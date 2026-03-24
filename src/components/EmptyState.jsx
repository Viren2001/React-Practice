import React from "react";

const illustrations = {
  expenses: "📋",
  dashboard: "📊",
  reports: "📈",
  search: "🔍",
};

function EmptyState({ type = "expenses", title, subtitle, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{illustrations[type] || "📋"}</div>
      <h3 className="empty-state-title">{title || "Nothing here yet"}</h3>
      <p className="empty-state-subtitle">
        {subtitle || "Start by adding your first transaction"}
      </p>
      {action && (
        <button className="empty-state-btn" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
