import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GoldCoinStackSVG,
  MoneyVaultSVG,
  MoneyGrowthSVG,
  FinancialShieldSVG,
  DiamondWealthSVG,
  BanknoteSVG
} from "./MoneyIcons";
import {
  ShieldCheck,
  Award,
  Sliders,
  PieChart as PieChartIcon,
  Sparkles,
  Calculator,
  Compass
} from "lucide-react";

export default function MoneyAnalyzer({ expenses = [], budget = 0, currency = "₹", month = "All" }) {
  const [activeTab, setActiveTab] = useState("score"); // 'score' | 'simulator' | 'runway' | 'leaks'

  // Simulator Sliders State
  const [monthlyIncome, setMonthlyIncome] = useState(budget ? Math.round(budget * 1.3) : 50000);
  const [targetSavingsRate, setTargetSavingsRate] = useState(25); // %
  const [investmentReturn, setInvestmentReturn] = useState(10); // % p.a.
  const [cutbackPercent, setCutbackPercent] = useState(15); // % cutback on top category

  // 1. Calculate Core Financial Metrics
  const metrics = useMemo(() => {
    const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const count = expenses.length;
    
    // Effective monthly budget
    const effectiveBudget = budget > 0 ? budget : (totalSpent > 0 ? totalSpent * 1.1 : 30000);
    
    // Category Breakdown
    const catMap = {};
    expenses.forEach(e => {
      const cat = e.category || "Other";
      catMap[cat] = (catMap[cat] || 0) + Number(e.amount || 0);
    });
    const sortedCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCats[0] || ["None", 0];

    // Budget Adherence Score (0 to 35 pts)
    let budgetScore = 35;
    if (effectiveBudget > 0) {
      const ratio = totalSpent / effectiveBudget;
      if (ratio <= 0.7) budgetScore = 35;
      else if (ratio <= 0.9) budgetScore = 30;
      else if (ratio <= 1.0) budgetScore = 22;
      else if (ratio <= 1.2) budgetScore = 12;
      else budgetScore = 5;
    }

    // Velocity / Daily Burn Rate (0 to 25 pts)
    const daysInMonth = 30;
    const now = new Date();
    const currentDay = Math.max(1, now.getDate());
    const dailyAvg = totalSpent / (month === "All" ? 30 : currentDay);
    const safeDailyLimit = effectiveBudget / daysInMonth;
    
    let velocityScore = 25;
    if (dailyAvg <= safeDailyLimit) velocityScore = 25;
    else if (dailyAvg <= safeDailyLimit * 1.25) velocityScore = 18;
    else if (dailyAvg <= safeDailyLimit * 1.5) velocityScore = 10;
    else velocityScore = 4;

    // Concentration Score (0 to 20 pts)
    let concentrationScore = 20;
    if (totalSpent > 0 && topCategory[1] > 0) {
      const topShare = topCategory[1] / totalSpent;
      if (topShare > 0.5) concentrationScore = 8;
      else if (topShare > 0.35) concentrationScore = 14;
    }

    // Logging Consistency Score (0 to 20 pts)
    let consistencyScore = Math.min(20, count * 2);

    const overallScore = Math.min(100, Math.round(budgetScore + velocityScore + concentrationScore + consistencyScore));

    // Score Status Label
    let statusLabel = "Optimal Wealth Discipline";
    let statusColor = "#10b981";
    let statusBadgeClass = "badge-optimal";

    if (overallScore < 50) {
      statusLabel = "High Spending Risk";
      statusColor = "#ef4444";
      statusBadgeClass = "badge-risk";
    } else if (overallScore < 75) {
      statusLabel = "Moderate Cashflow Pacing";
      statusColor = "#f59e0b";
      statusBadgeClass = "badge-moderate";
    }

    return {
      totalSpent,
      effectiveBudget,
      dailyAvg,
      safeDailyLimit,
      topCategory,
      overallScore,
      statusLabel,
      statusColor,
      statusBadgeClass,
      catMap,
      sortedCats
    };
  }, [expenses, budget, month]);

  // 2. Wealth Simulator Calculations
  const simulation = useMemo(() => {
    const income = Number(monthlyIncome) || 0;
    const currentSpend = metrics.totalSpent || (income * 0.75);
    const topCatSpend = metrics.topCategory[1] || (currentSpend * 0.3);
    
    // Savings through cutback
    const monthlyCutbackSavings = (topCatSpend * (cutbackPercent / 100));
    const targetMonthlySavings = income * (targetSavingsRate / 100);
    const totalPotentialMonthlySavings = targetMonthlySavings + monthlyCutbackSavings;

    // Compound Interest Growth formula over 1 Year and 5 Years
    const r = (investmentReturn / 100) / 12; // monthly rate
    const n1 = 12;
    const n5 = 60;

    // FV = P * (((1 + r)^n - 1) / r)
    const projected1Yr = r > 0 
      ? totalPotentialMonthlySavings * (((Math.pow(1 + r, n1) - 1) / r))
      : totalPotentialMonthlySavings * 12;

    const projected5Yr = r > 0 
      ? totalPotentialMonthlySavings * (((Math.pow(1 + r, n5) - 1) / r))
      : totalPotentialMonthlySavings * 60;

    return {
      monthlyCutbackSavings,
      targetMonthlySavings,
      totalPotentialMonthlySavings,
      projected1Yr: Math.round(projected1Yr),
      projected5Yr: Math.round(projected5Yr)
    };
  }, [monthlyIncome, targetSavingsRate, investmentReturn, cutbackPercent, metrics]);

  return (
    <div className="money-analyzer-container card glass-effect">
      {/* Header Banner */}
      <div className="money-analyzer-header">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            background: "linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)",
            padding: "12px",
            borderRadius: "18px",
            boxShadow: "0 10px 25px var(--primary-glow)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            <GoldCoinStackSVG size={36} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <h3 style={{ margin: 0, fontSize: "clamp(18px, 3vw, 22px)", fontWeight: "900", letterSpacing: "-0.03em" }}>
                Money Health & Wealth Intelligence
              </h3>
              <span className="sparkle-badge" style={{
                background: "rgba(var(--primary-rgb), 0.15)",
                color: "var(--primary)",
                padding: "2px 8px",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: "800",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <Sparkles size={12} /> PRO ANALYZER
              </span>
            </div>
            <p style={{ margin: "4px 0 0 0", color: "var(--text-muted)", fontSize: "13px", fontWeight: "600" }}>
              Comprehensive real-time analysis of cash flow, burn rate, and 5-year wealth trajectory.
            </p>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="money-analyzer-tabs">
          {[
            { id: "score", label: "Health Gauge", icon: Award },
            { id: "simulator", label: "Wealth Simulator", icon: Calculator },
            { id: "runway", label: "Cashflow Pacing", icon: Compass },
            { id: "leaks", label: "Spending Radar", icon: PieChartIcon }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`money-analyzer-tab-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={15} />
                <span className="tab-label-text">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Tab Body */}
      <AnimatePresence mode="wait">
        {activeTab === "score" && (
          <motion.div
            key="score"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="money-analyzer-score-grid"
          >
            {/* Health Score Circular Dial */}
            <div style={{
              background: "rgba(var(--bg-card-rgb), 0.4)",
              borderRadius: "24px",
              padding: "24px",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              position: "relative"
            }}>
              <div style={{ position: "relative", width: "150px", height: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="150" height="150" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={metrics.statusColor}
                    strokeWidth="10"
                    strokeDasharray="314"
                    strokeDashoffset={314 - (314 * metrics.overallScore) / 100}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
                  />
                </svg>
                <div style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <span style={{ fontSize: "36px", fontWeight: "900", color: "var(--text-main)", letterSpacing: "-0.04em" }}>
                    {metrics.overallScore}
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
                    SCORE / 100
                  </span>
                </div>
              </div>

              <div style={{
                marginTop: "16px",
                padding: "6px 14px",
                borderRadius: "20px",
                background: `rgba(${metrics.statusColor === '#10b981' ? '16, 185, 129' : metrics.statusColor === '#f59e0b' ? '245, 158, 11' : '239, 68, 68'}, 0.15)`,
                color: metrics.statusColor,
                fontWeight: "800",
                fontSize: "12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}>
                <ShieldCheck size={16} /> {metrics.statusLabel}
              </div>
            </div>

            {/* Score Breakdown Analysis Cards */}
            <div className="money-analyzer-score-cards">
              <div style={{ background: "rgba(var(--bg-card-rgb), 0.3)", padding: "16px", borderRadius: "18px", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--primary)", marginBottom: "8px" }}>
                  <MoneyVaultSVG size={24} />
                  <span style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase" }}>Budget Compliance</span>
                </div>
                <div style={{ fontSize: "18px", fontWeight: "900", color: "var(--text-main)" }}>
                  {metrics.effectiveBudget > 0 ? `${Math.round((metrics.totalSpent / metrics.effectiveBudget) * 100)}%` : "0%"} limit used
                </div>
                <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
                  {metrics.totalSpent <= metrics.effectiveBudget ? "Well within monthly allocation." : "Exceeding allocated budget limit!"}
                </p>
              </div>

              <div style={{ background: "rgba(var(--bg-card-rgb), 0.3)", padding: "16px", borderRadius: "18px", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#10b981", marginBottom: "8px" }}>
                  <MoneyGrowthSVG size={24} />
                  <span style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase" }}>Burn Velocity</span>
                </div>
                <div style={{ fontSize: "18px", fontWeight: "900", color: "var(--text-main)" }}>
                  {currency}{metrics.dailyAvg.toFixed(0)} <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>/ day</span>
                </div>
                <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
                  Recommended max: {currency}{metrics.safeDailyLimit.toFixed(0)}/day.
                </p>
              </div>

              <div style={{ background: "rgba(var(--bg-card-rgb), 0.3)", padding: "16px", borderRadius: "18px", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#3b82f6", marginBottom: "8px" }}>
                  <DiamondWealthSVG size={24} />
                  <span style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase" }}>Top Category Share</span>
                </div>
                <div style={{ fontSize: "18px", fontWeight: "900", color: "var(--text-main)" }}>
                  {metrics.topCategory[0]} ({metrics.totalSpent > 0 ? Math.round((metrics.topCategory[1] / metrics.totalSpent) * 100) : 0}%)
                </div>
                <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
                  Diversifying spending keeps budget resilient.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "simulator" && (
          <motion.div
            key="simulator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="money-analyzer-sim-grid">
              {/* Sliders Control Panel */}
              <div style={{ background: "rgba(var(--bg-card-rgb), 0.3)", padding: "20px", borderRadius: "20px", border: "1px solid var(--border)" }}>
                <h4 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Sliders size={18} color="var(--primary)" /> Wealth Parameters Simulator
                </h4>

                {/* Monthly Income Slider */}
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", marginBottom: "6px" }}>
                    <span>Monthly Income Benchmark:</span>
                    <span style={{ color: "var(--primary)", fontWeight: "900" }}>{currency}{Number(monthlyIncome).toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    style={{ width: "100%", accentColor: "var(--primary)", cursor: "pointer" }}
                  />
                </div>

                {/* Target Savings Rate Slider */}
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", marginBottom: "6px" }}>
                    <span>Target Monthly Savings Rate:</span>
                    <span style={{ color: "#10b981", fontWeight: "900" }}>{targetSavingsRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={targetSavingsRate}
                    onChange={(e) => setTargetSavingsRate(e.target.value)}
                    style={{ width: "100%", accentColor: "#10b981", cursor: "pointer" }}
                  />
                </div>

                {/* Investment Return Rate */}
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", marginBottom: "6px" }}>
                    <span>Expected Investment Growth Rate (p.a.):</span>
                    <span style={{ color: "#3b82f6", fontWeight: "900" }}>{investmentReturn}%</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    step="1"
                    value={investmentReturn}
                    onChange={(e) => setInvestmentReturn(e.target.value)}
                    style={{ width: "100%", accentColor: "#3b82f6", cursor: "pointer" }}
                  />
                </div>

                {/* Top Category Cutback Slider */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", marginBottom: "6px" }}>
                    <span>Cutback on {metrics.topCategory[0]}:</span>
                    <span style={{ color: "#f59e0b", fontWeight: "900" }}>{cutbackPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={cutbackPercent}
                    onChange={(e) => setCutbackPercent(e.target.value)}
                    style={{ width: "100%", accentColor: "#f59e0b", cursor: "pointer" }}
                  />
                </div>
              </div>

              {/* Wealth Projection Results */}
              <div style={{
                background: "linear-gradient(135deg, rgba(var(--primary-rgb), 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                padding: "20px",
                borderRadius: "20px",
                border: "1.5px solid var(--primary-glow)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
                    PROJECTED POTENTIAL SAVINGS
                  </div>
                  <div style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: "900", color: "var(--primary)", letterSpacing: "-0.04em" }}>
                    {currency}{simulation.totalPotentialMonthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>/ mo</span>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Includes {currency}{simulation.targetMonthlySavings.toFixed(0)} target savings + {currency}{simulation.monthlyCutbackSavings.toFixed(0)} from spending optimization.
                  </p>
                </div>

                <div className="money-analyzer-proj-boxes" style={{ marginTop: "16px" }}>
                  <div style={{ background: "rgba(var(--bg-card-rgb), 0.6)", padding: "14px", borderRadius: "14px", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "10px", fontWeight: "800", color: "#10b981", textTransform: "uppercase" }}>1-YEAR WEALTH</div>
                    <div style={{ fontSize: "18px", fontWeight: "900", color: "var(--text-main)", marginTop: "4px" }}>
                      {currency}{simulation.projected1Yr.toLocaleString()}
                    </div>
                  </div>

                  <div style={{ background: "rgba(var(--bg-card-rgb), 0.6)", padding: "14px", borderRadius: "14px", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "10px", fontWeight: "800", color: "#3b82f6", textTransform: "uppercase" }}>5-YEAR COMPOUNDED</div>
                    <div style={{ fontSize: "18px", fontWeight: "900", color: "var(--text-main)", marginTop: "4px" }}>
                      {currency}{simulation.projected5Yr.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "runway" && (
          <motion.div
            key="runway"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="money-analyzer-runway-grid"
          >
            <div style={{ background: "rgba(var(--bg-card-rgb), 0.4)", padding: "20px", borderRadius: "20px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <BanknoteSVG size={32} />
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--text-muted)" }}>SAFE DAILY EXPENSE CAP</div>
                  <div style={{ fontSize: "22px", fontWeight: "900", color: "var(--text-main)" }}>
                    {currency}{metrics.safeDailyLimit.toFixed(2)}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                To remain perfectly under your monthly budget limit.
              </p>
            </div>

            <div style={{ background: "rgba(var(--bg-card-rgb), 0.4)", padding: "20px", borderRadius: "20px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <FinancialShieldSVG size={32} />
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--text-muted)" }}>PROJECTED MONTH-END SURPLUS</div>
                  <div style={{ fontSize: "22px", fontWeight: "900", color: metrics.effectiveBudget - metrics.totalSpent >= 0 ? "#10b981" : "#ef4444" }}>
                    {currency}{(metrics.effectiveBudget - metrics.totalSpent).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                {metrics.effectiveBudget - metrics.totalSpent >= 0 ? "You have remaining liquidity!" : "Warning: Budget threshold crossed."}
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === "leaks" && (
          <motion.div
            key="leaks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {metrics.sortedCats.length === 0 ? (
                <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>No categories logged yet.</p>
              ) : (
                metrics.sortedCats.map(([catName, amt], idx) => {
                  const share = metrics.totalSpent > 0 ? (amt / metrics.totalSpent) * 100 : 0;
                  return (
                    <div key={catName} className="money-analyzer-leak-item">
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "10px",
                          background: "rgba(var(--primary-rgb), 0.1)",
                          color: "var(--primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "900",
                          fontSize: "13px"
                        }}>
                          #{idx + 1}
                        </div>
                        <div>
                          <div style={{ fontWeight: "800", fontSize: "14px" }}>{catName}</div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{share.toFixed(1)}% of total expenditure</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "15px", fontWeight: "900", color: "var(--text-main)" }}>
                          {currency}{amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        {share > 30 && (
                          <span style={{ fontSize: "10px", fontWeight: "800", color: "#f59e0b" }}>High Concentration Leak</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
