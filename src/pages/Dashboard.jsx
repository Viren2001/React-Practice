import React, { useState, useEffect, useMemo } from "react";
import PageHeader from "../components/PageHeader";
import { getCategoryIcon } from "../utils/categoryIcons";
import BudgetAlert from "../components/BudgetAlert";
import EmptyState from "../components/EmptyState";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import MonthSelector from "../components/MonthSelector";
import { isDateInPeriod, formatPeriodLabel, getDaysInPeriod } from "../utils/dateUtils";
import {
    Wallet,
    TrendingDown,
    Calendar,
    ArrowRight,
    Activity,
    Target,
    PieChart as PieChartIcon,
    BarChart3
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Scatter } from "recharts";

const COLORS = ['#d946ef', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

function Dashboard({ expenses = [], month, setMonth, budget = 0, updateBudget, currency = "$" }) {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    // Filter expenses using the new robust date utility
    const periodExpenses = expenses.filter(exp => isDateInPeriod(exp.date, month));
    
    // Total for selected period
    const periodTotal = periodExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    // Category totals
    const categoryTotalsArr = useMemo(() => {
        const totals = periodExpenses.reduce((acc, exp) => {
            const cat = exp.category || "Other";
            acc[cat] = (acc[cat] || 0) + Number(exp.amount);
            return acc;
        }, {});
        return Object.entries(totals)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [periodExpenses]);

    const topCategory = categoryTotalsArr[0];

    // Chart Data Preparation (Group by small chunks based on period type)
    const chartData = useMemo(() => {
        if (periodExpenses.length === 0) return [];
        const dataMap = {};
        
        // Always sort by date first
        const sorted = [...periodExpenses].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        sorted.forEach(exp => {
            const dateStr = exp.date; // YYYY-MM-DD
            if(!dataMap[dateStr]) dataMap[dateStr] = 0;
            dataMap[dateStr] += Number(exp.amount);
        });

        // Convert to array and format dates beautifully
        return Object.entries(dataMap).map(([date, amount]) => {
            const d = new Date(date);
            return {
                date: date,
                displayDate: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                amount: amount
            };
        });
    }, [periodExpenses]);

    // Daily average calculation based on current progress of period
    const daysInPeriod = getDaysInPeriod(month);
    const dailyAvg = daysInPeriod > 0 ? periodTotal / daysInPeriod : 0;

    // Budget Logic (scale budget to period if needed, but standard budget is monthly. 
    // If viewing Yearly or Quarterly, should budget scale? For now, we assume budget is just a target comparison,
    // let's scale it for accurate representation: month=1x, quarter=3x, year=12x
    let effectiveBudget = budget;
    if (month && month !== "All") {
        const parts = month.split("-");
        if (parts.length === 1) effectiveBudget = budget * 12; // Yearly
        else if (parts[1].startsWith("Q")) effectiveBudget = budget * 3; // Quarterly
    }

    const budgetPercent = effectiveBudget > 0 ? Math.min((periodTotal / effectiveBudget) * 100, 100) : 0;

    // Local Edit Budget State
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [tempBudget, setTempBudget] = useState(budget);

    useEffect(() => { setTempBudget(budget); }, [budget]);

    const handleSaveBudget = () => {
        updateBudget(tempBudget);
        setIsEditingBudget(false);
    };

    const periodLabel = formatPeriodLabel(month);

    return (
        <div className="page-container" style={{ paddingBottom: "60px" }}>
            <div className="page-header-container" style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
                <div>
                    <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: "900", marginBottom: "8px", letterSpacing: "-0.04em" }}>
                        Overview
                    </h2>
                    <p style={{ color: "var(--text-muted)", fontWeight: "600", fontSize: "clamp(13px, 3vw, 15px)" }}>Your financial command center for {periodLabel}.</p>
                </div>
                
                <div style={{ width: "240px", zIndex: 10 }}>
                    <MonthSelector value={month} onChange={setMonth} options={[{ label: "Full History", value: "All" }]} />
                </div>
            </div>

            <BudgetAlert spent={periodTotal} budget={effectiveBudget} currency={currency} />

            {/* Quick Stats Top Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "24px" }}>
                
                {/* Total Spend */}
                <div className="card glass-effect" style={{ borderTop: "4px solid var(--primary)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, left: 0, background: "radial-gradient(circle at top right, rgba(var(--primary-rgb), 0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                        <div style={{ background: "rgba(var(--primary-rgb), 0.1)", color: "var(--primary)", padding: "10px", borderRadius: "12px" }}>
                            <Wallet size={20} />
                        </div>
                        <h3 className="card-label" style={{ margin: 0, fontSize: "14px" }}>Total Spend</h3>
                    </div>
                    <p style={{ color: "var(--text-main)", margin: "0 0 8px 0", fontSize: "38px", fontWeight: "900", letterSpacing: "-0.04em", display: "flex", alignItems: "baseline", gap: "4px" }}>
                        <span style={{ fontSize: "20px", color: "var(--primary)" }}>{currency}</span>
                        {periodTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Activity size={14} /> {periodExpenses.length} transactions in {periodLabel}
                    </div>
                </div>

                {/* Budget Tracker */}
                <div className="card glass-effect" style={{ borderTop: "4px solid #10b981", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, left: 0, background: "radial-gradient(circle at top right, rgba(16, 185, 129, 0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", position: "relative" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "10px", borderRadius: "12px" }}>
                                <Target size={20} />
                            </div>
                            <h3 className="card-label" style={{ margin: 0, fontSize: "14px" }}>{month === "All" ? "Total Budget Limit" : `${periodLabel} Budget`}</h3>
                        </div>
                        <button
                            onClick={() => isEditingBudget ? handleSaveBudget() : setIsEditingBudget(true)}
                            style={{ background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}
                        >
                            {isEditingBudget ? "SAVE" : "EDIT BASE"}
                        </button>
                    </div>

                    {isEditingBudget ? (
                        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "12px" }}>
                           <span style={{ fontWeight: "900", color: "#10b981", fontSize: "20px" }}>{currency}</span>
                           <input
                               type="number"
                               value={tempBudget}
                               onChange={(e) => setTempBudget(e.target.value)}
                               autoFocus
                               style={{ padding: "8px 12px", borderRadius: "10px", border: "2px solid #10b981", width: "100%", fontSize: "18px", fontWeight: "900", background: "rgba(var(--bg-card-rgb), 0.8)" }}
                           />
                           <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>/mo</div>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                                <div style={{ fontSize: "24px", fontWeight: "900", color: budgetPercent >= 100 ? "var(--danger)" : "var(--text-main)" }}>
                                    {currency}{effectiveBudget.toLocaleString()}
                                </div>
                                <div style={{ fontSize: "14px", fontWeight: "800", color: budgetPercent >= 100 ? "var(--danger)" : "var(--text-muted)" }}>
                                    {budgetPercent.toFixed(0)}% Used
                                </div>
                            </div>
                            <div style={{ height: "12px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "10px", overflow: "hidden", position: "relative" }}>
                                <div style={{ 
                                    position: "absolute", left: 0, top: 0, bottom: 0, 
                                    width: `${budgetPercent}%`, 
                                    background: budgetPercent >= 100 ? "var(--danger)" : "linear-gradient(90deg, #10b981, #34d399)",
                                    borderRadius: "10px",
                                    transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)"
                                }} />
                            </div>
                            <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "700", marginTop: "12px" }}>
                                {effectiveBudget - periodTotal >= 0 ? `${currency}${(effectiveBudget - periodTotal).toLocaleString(undefined, {minimumFractionDigits: 2})} remaining` : `${currency}${(periodTotal - effectiveBudget).toLocaleString()} over budget `}
                            </div>
                        </>
                    )}
                </div>

                {/* Daily Average & Top Category */}
                <div className="card glass-effect" style={{ borderTop: "4px solid #3b82f6", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                   <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, left: 0, background: "radial-gradient(circle at top right, rgba(59, 130, 246, 0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
                   <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", position: "relative" }}>
                       <div style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", padding: "12px", borderRadius: "14px" }}>
                           <BarChart3 size={24} />
                       </div>
                       <div>
                           <div style={{ fontSize: "12px", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase" }}>Avg Daily Spend</div>
                           <div style={{ fontSize: "22px", fontWeight: "900", color: "var(--text-main)" }}>{currency}{dailyAvg.toFixed(2)}</div>
                       </div>
                   </div>
                   
                   <div style={{ height: "1px", background: "var(--border)", margin: "0 0 16px 0" }} />

                   <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                       <div style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", padding: "12px", borderRadius: "14px" }}>
                           {topCategory ? getCategoryIcon(topCategory.name) : <PieChartIcon size={24} />}
                       </div>
                       <div>
                           <div style={{ fontSize: "12px", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase" }}>Top Category</div>
                           <div style={{ fontSize: "18px", fontWeight: "900", color: "var(--text-main)", display: "flex", alignItems: "baseline", gap: "8px" }}>
                               {topCategory ? topCategory.name : "None"} 
                               {topCategory && <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>({Math.round((topCategory.value / periodTotal) * 100)}%)</span>}
                           </div>
                       </div>
                   </div>
                </div>
            </div>

            {/* Main Visualizations Row */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "24px" }}>
                {/* Trend Chart */}
                <div className="card glass-effect">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <TrendingDown size={20} color="var(--primary)" />
                            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800" }}>Cashflow Trend</h3>
                        </div>
                    </div>
                    {chartData.length > 0 ? (
                        <div style={{ height: "260px", width: "100%" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600}} dx={-10} tickFormatter={(val) => `${currency}${val}`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.1)', fontWeight: '700' }}
                                        itemStyle={{ color: 'var(--primary)', fontWeight: '900' }}
                                        formatter={(value) => [`${currency}${Number(value).toFixed(2)}`, 'Spent']}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div style={{ height: "260px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <EmptyState type="dashboard" title="No Trend Data" subtitle="Your spending rhythm will appear here." hideAction />
                        </div>
                    )}
                </div>

                {/* Category Pie */}
                <div className="card glass-effect" style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                        <PieChartIcon size={20} color="#10b981" />
                        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800" }}>Distribution</h3>
                    </div>
                    {categoryTotalsArr.length > 0 ? (
                        <>
                            <div style={{ height: "180px", width: "100%", alignSelf: "center", margin: "auto 0" }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryTotalsArr}
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={3}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {categoryTotalsArr.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            formatter={(value) => `${currency}${Number(value).toFixed(2)}`}
                                            contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', fontWeight: '700' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginTop: "16px", maxHeight: "60px", overflow: "hidden" }}>
                                {categoryTotalsArr.slice(0, 4).map((cat, i) => (
                                    <div key={cat.name} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "700", padding: "4px 8px", background: "rgba(var(--bg-card-rgb), 0.5)", borderRadius: "8px" }}>
                                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: COLORS[i % COLORS.length] }} />
                                        <span>{cat.name}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                             <span style={{ color: "var(--text-muted)", fontSize: "13px", fontWeight: "600" }}>No distribution data</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Expenses List */}
            <div className="card glass-effect" style={{ padding: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Wallet size={20} color="var(--primary)" />
                        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "900", letterSpacing: "-0.02em" }}>Recent Transactions</h3>
                    </div>
                    <button
                        onClick={() => navigate('/expenses')}
                        style={{
                            backgroundColor: "rgba(var(--primary-rgb), 0.08)",
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
                        View Ledger <ArrowRight size={14} />
                    </button>
                </div>

                {periodExpenses.length === 0 ? (
                    <EmptyState
                        type="dashboard"
                        title="Quiet Period"
                        subtitle="No spending recorded in this timeframe yet."
                        action={{ label: "Add Transaction", onClick: () => navigate('/expenses') }}
                    />
                ) : (
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                        {periodExpenses.slice(-6).reverse().map((exp) => (
                            <li key={exp.id} className="expense-item" style={{ margin: 0, background: "rgba(var(--bg-card-rgb), 0.4)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <div className="expense-icon-box" style={{ background: "var(--bg-app)", width: "40px", height: "40px" }}>
                                        {getCategoryIcon(exp.category)}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: "800", fontSize: "15px", color: "var(--text-main)", marginBottom: "2px" }}>
                                            {exp.name}
                                        </div>
                                        <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>
                                            {exp.category} • {new Date(exp.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ fontWeight: "900", fontSize: "18px", color: "var(--text-main)" }}>
                                    - {currency}{Number(exp.amount).toFixed(2)}
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
