import React from "react";
import { 
  Plus, 
  Search, 
  BarChart3, 
  PieChart, 
  Wallet,
  Inbox
} from "lucide-react";

const icons = {
  expenses: <Wallet size={48} />,
  dashboard: <BarChart3 size={48} />,
  reports: <PieChart size={48} />,
  search: <Search size={48} />,
};

function EmptyState({ type = "expenses", title, subtitle, action }) {
  return (
    <div className="empty-state glass" style={{ 
        padding: "60px 20px",
        textAlign: "center",
        borderRadius: "24px",
        background: "rgba(var(--bg-card-rgb), 0.2)",
        marginTop: "20px"
    }}>
      <div className="empty-state-icon" style={{ 
          color: "var(--primary)", 
          marginBottom: "24px",
          display: "flex",
          justifyContent: "center",
          opacity: 0.6
      }}>
        {icons[type] || <Inbox size={48} />}
      </div>
      <h3 className="empty-state-title" style={{ 
          fontSize: "20px", 
          fontWeight: "900", 
          marginBottom: "10px",
          letterSpacing: "-0.03em"
      }}>
        {title || "Nothing here yet"}
      </h3>
      <p className="empty-state-subtitle" style={{ 
          fontSize: "14px", 
          color: "var(--text-muted)", 
          fontWeight: "600",
          maxWidth: "320px",
          margin: "0 auto 32px auto",
          lineHeight: "1.6"
      }}>
        {subtitle || "Start by adding your first transaction to get insights."}
      </p>
      {action && (
        <button 
          className="btn-primary" 
          onClick={action.onClick}
          style={{ 
              padding: "12px 24px",
              boxShadow: "0 10px 20px var(--primary-glow)",
              borderRadius: "14px"
          }}
        >
          <Plus size={18} /> {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
