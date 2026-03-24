import React from "react";
import { AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";

function BudgetAlert({ spent, budget, currency = "$" }) {
  if (!budget || budget <= 0) return null;

  const percentage = (spent / budget) * 100;

  if (percentage < 50) return null;

  let alertType, icon, message;

  if (percentage >= 100) {
    alertType = "danger";
    icon = <AlertTriangle size={18} />;
    message = `Budget exceeded! You've spent ${currency}${spent.toFixed(2)} of ${currency}${budget.toFixed(2)} (${percentage.toFixed(0)}%)`;
  } else if (percentage >= 80) {
    alertType = "warning";
    icon = <TrendingUp size={18} />;
    message = `Heads up! You've used ${percentage.toFixed(0)}% of your monthly budget (${currency}${(budget - spent).toFixed(2)} remaining)`;
  } else {
    alertType = "info";
    icon = <CheckCircle size={18} />;
    message = `You've used ${percentage.toFixed(0)}% of your budget. On track!`;
  }

  return (
    <div className={`budget-alert budget-alert-${alertType}`}>
      <span className="budget-alert-icon">{icon}</span>
      <span className="budget-alert-message">{message}</span>
    </div>
  );
}

export default BudgetAlert;
