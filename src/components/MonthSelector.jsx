import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Check, Globe } from "lucide-react";

const MonthSelector = ({ value, onChange, label, options = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Parse current value (YYYY-MM)
  const isAll = value === "All";
  const [year, month] = !isAll ? value.split("-").map(Number) : [new Date().getFullYear(), new Date().getMonth() + 1];
  const [viewYear, setViewYear] = useState(year);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMonthClick = (mIndex) => {
    const formattedMonth = String(mIndex + 1).padStart(2, "0");
    const newValue = `${viewYear}-${formattedMonth}`;
    onChange(newValue);
    setIsOpen(false);
  };

  const handleAllClick = () => {
    onChange("All");
    setIsOpen(false);
  };

  const currentMonthName = isAll ? "Full History" : months[month - 1];

  return (
    <div className="month-selector-container" ref={dropdownRef}>
      {label && <label className="card-label">{label}</label>}
      <div 
        className={`month-selector-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="month-icon-box">
            {isAll ? <Globe size={16} /> : <Calendar size={16} />}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span className="current-month-text">{currentMonthName} {!isAll && year}</span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "700" }}>Selected Period</span>
          </div>
        </div>
        <div className={`chevron ${isOpen ? 'rotated' : ''}`}>
           <ChevronLeft size={16} />
        </div>
      </div>

      {isOpen && (
        <div className="month-selector-menu animate-slide-down">
          {options.some(opt => opt.value === "All") && (
            <button 
              onClick={handleAllClick}
              className={`month-btn ${isAll ? 'selected' : ''}`}
              style={{ width: "100%", marginBottom: "12px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              <Globe size={14} /> Full History
            </button>
          )}
          
          <div className="month-selector-header">
            <button onClick={() => setViewYear(viewYear - 1)} className="year-nav-btn">
              <ChevronLeft size={16} />
            </button>
            <span className="view-year-text">{viewYear}</span>
            <button onClick={() => setViewYear(viewYear + 1)} className="year-nav-btn">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="months-grid">
            {months.map((m, index) => {
              const isSelected = !isAll && year === viewYear && month === index + 1;
              return (
                <button
                  key={m}
                  className={`month-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleMonthClick(index)}
                >
                  {m.slice(0, 3)}
                  {isSelected && <div className="selected-dot" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthSelector;
