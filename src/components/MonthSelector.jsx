import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Globe, Clock, Layers } from "lucide-react";
import { formatPeriodLabel } from "../utils/dateUtils";

const MonthSelector = ({ value, onChange, label, options = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAll = value === "All";
  const parts = !isAll ? value.split("-") : [];
  const currentYear = parts.length > 0 ? Number(parts[0]) : new Date().getFullYear();
  
  // Identify type: "month", "quarter", "year"
  let initialType = "year";
  if (!isAll && parts.length === 2) {
    initialType = parts[1].startsWith("Q") ? "quarter" : "month";
  }
  
  const [viewYear, setViewYear] = useState(currentYear);
  const [viewType, setViewType] = useState(isAll ? "month" : initialType);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const quarters = ["Q1", "Q2", "Q3", "Q4"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (newValue) => {
    onChange(newValue);
    setIsOpen(false);
  };

  const currentLabelText = formatPeriodLabel(value);

  return (
    <div className="month-selector-container" ref={dropdownRef} style={{ position: "relative" }}>
      {label && <label className="card-label">{label}</label>}
      <div 
        className={`month-selector-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{
            background: "rgba(var(--bg-card-rgb), 0.5)",
            border: isOpen ? "2px solid var(--primary)" : "2px solid var(--border)",
            borderRadius: "14px",
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.3s"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="month-icon-box" style={{ background: "rgba(var(--primary-rgb), 0.1)", color: "var(--primary)", padding: "10px", borderRadius: "10px" }}>
            {isAll ? <Globe size={18} /> : viewType === "year" ? <Clock size={18} /> : viewType === "quarter" ? <Layers size={18} /> : <Calendar size={18} />}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--text-main)" }}>{currentLabelText}</span>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "700" }}>Selected Timeline</span>
          </div>
        </div>
        <div className={`chevron ${isOpen ? 'rotated' : ''}`} style={{ transition: "transform 0.3s", transform: isOpen ? "rotate(-90deg)" : "rotate(0deg)", color: "var(--text-muted)" }}>
           <ChevronLeft size={18} />
        </div>
      </div>

      {isOpen && (
        <div className="month-selector-menu animate-slide-down" style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            left: 0,
            right: 0,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "16px",
            boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)",
            zIndex: 100
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: "rgba(var(--bg-card-rgb), 0.5)", padding: "4px", borderRadius: "12px", marginBottom: "16px" }}>
             {["month", "quarter", "year"].map(type => (
                 <button
                    key={type}
                    onClick={() => setViewType(type)}
                    style={{
                        flex: 1,
                        background: viewType === type ? "var(--primary)" : "transparent",
                        color: viewType === type ? "white" : "var(--text-muted)",
                        border: "none",
                        padding: "8px",
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: "800",
                        textTransform: "uppercase"
                    }}
                 >
                     {type}
                 </button>
             ))}
          </div>

          <div className="month-selector-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <button onClick={() => setViewYear(viewYear - 1)} style={{ background: "transparent", border: "none", color: "var(--text-main)", cursor: "pointer" }}>
              <ChevronLeft size={18} />
            </button>
            <span style={{ fontSize: "16px", fontWeight: "900" }}>{viewYear}</span>
            <button onClick={() => setViewYear(viewYear + 1)} style={{ background: "transparent", border: "none", color: "var(--text-main)", cursor: "pointer" }}>
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="months-grid" style={{ 
              display: "grid", 
              gridTemplateColumns: viewType === "month" ? "repeat(3, 1fr)" : viewType === "quarter" ? "repeat(2, 1fr)" : "1fr", 
              gap: "8px" 
          }}>
            {viewType === "month" && months.map((m, index) => {
              const formattedMonth = String(index + 1).padStart(2, "0");
              const isSelected = value === `${viewYear}-${formattedMonth}`;
              return (
                <button
                  key={m}
                  style={{
                      background: isSelected ? "rgba(var(--primary-rgb), 0.1)" : "transparent",
                      color: isSelected ? "var(--primary)" : "var(--text-main)",
                      border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border)",
                      padding: "10px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer"
                  }}
                  onClick={() => handleSelect(`${viewYear}-${formattedMonth}`)}
                >
                  {m.slice(0, 3)}
                </button>
              );
            })}

            {viewType === "quarter" && quarters.map((q) => {
              const isSelected = value === `${viewYear}-${q}`;
              return (
                <button
                  key={q}
                  style={{
                      background: isSelected ? "rgba(var(--primary-rgb), 0.1)" : "transparent",
                      color: isSelected ? "var(--primary)" : "var(--text-main)",
                      border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border)",
                      padding: "14px",
                      borderRadius: "12px",
                      fontSize: "14px",
                      fontWeight: "800",
                      cursor: "pointer"
                  }}
                  onClick={() => handleSelect(`${viewYear}-${q}`)}
                >
                  {q}
                </button>
              );
            })}

            {viewType === "year" && (
                <button
                  style={{
                      background: value === `${viewYear}` ? "var(--primary)" : "rgba(var(--primary-rgb), 0.1)",
                      color: value === `${viewYear}` ? "white" : "var(--primary)",
                      border: "none",
                      padding: "16px",
                      borderRadius: "12px",
                      fontSize: "16px",
                      fontWeight: "900",
                      cursor: "pointer",
                      gridColumn: "1 / -1"
                  }}
                  onClick={() => handleSelect(`${viewYear}`)}
                >
                  Entire Year {viewYear}
                </button>
            )}
          </div>

          {options.some(opt => opt.value === "All") && (
            <button 
              onClick={() => handleSelect("All")}
              style={{
                  marginTop: "16px",
                  width: "100%",
                  background: isAll ? "var(--text-main)" : "var(--bg-app)",
                  color: isAll ? "var(--bg-card)" : "var(--text-main)",
                  border: "1px solid var(--border)",
                  padding: "12px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "800",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
              }}
            >
              <Globe size={14} /> Full History
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MonthSelector;
