import React from 'react';

function BudgetProgress({ spent, budget, currency = "$" }) {
    const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
    const isOverBudget = spent > budget && budget > 0;
    
    // Choose color based on status
    const getColor = () => {
        if (!budget) return "#e5e7eb";
        if (percentage >= 100) return "#ef4444"; // Red
        if (percentage >= 80) return "#f59e0b"; // Orange/Amber
        return "#10b981"; // Green
    };

    return (
        <div style={{ marginTop: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#6b7280" }}>
                    BUDGET PROGRESS
                </span>
                <span style={{ fontSize: "14px", fontWeight: "700", color: getColor() }}>
                    {percentage.toFixed(0)}%
                </span>
            </div>
            
            {/* Progress Bar Track */}
            <div style={{ 
                width: "100%", 
                height: "12px", 
                backgroundColor: "#f3f4f6", 
                borderRadius: "10px", 
                overflow: "hidden",
                position: "relative",
                border: "1px solid #e5e7eb"
            }}>
                {/* Progress Fill */}
                <div style={{ 
                    width: `${percentage}%`, 
                    height: "100%", 
                    backgroundColor: getColor(),
                    transition: "width 0.5s ease-out, background-color 0.5s",
                    borderRadius: percentage >= 100 ? "10px" : "10px 0 0 10px"
                }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "12px", color: "#9ca3af" }}>
                <span>Spent: {currency}{spent.toFixed(2)}</span>
                <span>Budget: {budget > 0 ? `${currency}${budget.toFixed(2)}` : "Not set"}</span>
            </div>

            {isOverBudget && (
                <div style={{ 
                    marginTop: "10px", 
                    padding: "8px", 
                    backgroundColor: "#fef2f2", 
                    color: "#991b1b", 
                    borderRadius: "6px", 
                    fontSize: "12px",
                    fontWeight: "500",
                    textAlign: "center",
                    border: "1px solid #fecaca"
                }}>
                    ⚠️ You have exceeded your monthly budget!
                </div>
            )}
        </div>
    );
}

export default BudgetProgress;
