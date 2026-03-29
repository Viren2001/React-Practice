import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

const CustomDropdown = ({ 
  options = [], 
  value, 
  onChange, 
  label, 
  icon, 
  placeholder = "Select option",
  searchable = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option => 
    String(option).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = value;

  return (
    <div className="custom-dropdown-container" ref={dropdownRef}>
      {label && <label className="card-label">{label}</label>}
      <div 
        className={`custom-dropdown-trigger ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="trigger-left">
          {icon && <span className="trigger-icon">{icon}</span>}
          <span className={`trigger-text ${!selectedOption ? 'placeholder' : ''}`}>
            {selectedOption || placeholder}
          </span>
        </div>
        <ChevronDown size={18} className={`chevron ${isOpen ? 'rotated' : ''}`} />
      </div>

      {isOpen && (
        <div className="custom-dropdown-menu animate-slide-down">
          {searchable && (
            <div className="dropdown-search">
              <Search size={14} />
              <input 
                autoFocus
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <ul className="dropdown-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, i) => (
                <li 
                  key={i} 
                  className={`dropdown-option ${value === opt ? 'selected' : ''}`}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  <span className="option-text">{opt}</span>
                  {value === opt && <Check size={14} className="check-icon" />}
                </li>
              ))
            ) : (
              <li className="dropdown-no-results">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
