import React, { useState, useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";
import CustomDropdown from "../components/CustomDropdown";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { Sun, Moon, Download, Save, User, Palette, Bell, DollarSign, Trash2, AlertCircle, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCategoryIcon } from "../utils/categoryIcons";
import { exportToCSV } from "../utils/exportCSV";
import { formatPeriodLabel } from "../utils/dateUtils";

function Settings({ expenses = [], month, categories = [], addCategory, deleteCategory }) {
  const { currentUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const toast = useToast();

  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [currency, setCurrency] = useState("₹");
  const [settingsDocId, setSettingsDocId] = useState(null);
  const [newCatName, setNewCatName] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  
  const initialValues = useRef({});
  const [isLoaded, setIsLoaded] = useState(false);

  const normalizeCategoryBudgets = (budgets = {}) => {
    const normalized = {};
    Object.keys(budgets)
      .sort()
      .forEach((key) => {
        const value = budgets[key];
        if (value === "" || value === null || value === undefined) return;
        const num = Number(value);
        if (!isNaN(num)) normalized[key] = num;
      });
    return normalized;
  };

  const normalizeCategories = (cats = []) => [...cats].sort();

  // Navigation Blocker - Simplified for v7
  const blocker = useBlocker(({ nextLocation }) => {
    // Return true to BLOCK navigation
    return isDirty && !nextLocation.pathname.includes("settings");
  });

  // Load settings from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "settings"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setSettingsDocId(snapshot.docs[0].id);
        
        const budgetValue = Number(data.monthlyBudget || 0);
        const catBudgetsValue = data.categoryBudgets || {};
        const thresholdValue = Number(data.alertThreshold || 80);
        const currencyValue = data.currency || "₹";
        const categoriesValue = data.categories || categories; // Use snapshot categories if available

        setMonthlyBudget(budgetValue);
        setCategoryBudgets(catBudgetsValue);
        setAlertThreshold(thresholdValue);
        setCurrency(currencyValue);

        // Always update initial values if not yet loaded
        if (!isLoaded) {
          initialValues.current = {
            monthlyBudget: budgetValue,
            categoryBudgets: normalizeCategoryBudgets(catBudgetsValue),
            alertThreshold: thresholdValue,
            currency: currencyValue,
            categories: normalizeCategories(categoriesValue)
          };
          setIsLoaded(true);
        }
      }
    });

    return unsubscribe;
  }, [currentUser, categories, isLoaded]); // Re-run if categories change before we are "loaded"

  // Native Browser protection
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Dirty check effect
  useEffect(() => {
    if (!isLoaded || !initialValues.current.currency) return;

    const currentValues = {
      monthlyBudget: Number(monthlyBudget),
      categoryBudgets: normalizeCategoryBudgets(categoryBudgets),
      alertThreshold: Number(alertThreshold),
      currency: currency,
      categories: normalizeCategories(categories)
    };

    const isDifferent = JSON.stringify(currentValues) !== JSON.stringify(initialValues.current);
    
    if (isDifferent !== isDirty) {
      setIsDirty(isDifferent);
    }
  }, [monthlyBudget, categoryBudgets, alertThreshold, currency, categories, isLoaded, isDirty]);

  // Handle navigation blocker with standard browser dialog
  useEffect(() => {
    if (blocker.state === "blocked") {
      console.log("Navigation Blocked!");
      const proceed = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (proceed) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  const handleSave = async () => {
    if (!currentUser) return;
    try {
      const settingsData = {
        userId: currentUser.uid,
        monthlyBudget: Number(monthlyBudget),
        categoryBudgets: normalizeCategoryBudgets(categoryBudgets),
        alertThreshold: Number(alertThreshold),
        currency,
        categories,
        updatedAt: Date.now(),
      };

      if (settingsDocId) {
        await updateDoc(doc(db, "settings", settingsDocId), settingsData);
      } else {
        settingsData.createdAt = Date.now();
        await addDoc(collection(db, "settings"), settingsData);
      }
      
      // Update initial values after successful save
      initialValues.current = {
        monthlyBudget: Number(monthlyBudget),
        categoryBudgets: normalizeCategoryBudgets(categoryBudgets),
        alertThreshold: Number(alertThreshold),
        currency: currency,
        categories: normalizeCategories(categories)
      };
      setIsDirty(false);
      
      toast.success("Preferences updated successfully!");
    } catch (err) {
      toast.error("Failed to save preferences");
    }
  };

  const handleDeleteCat = (cat) => {
    if (window.confirm(`Delete category "${cat}"? This won\'t affect existing transactions.`)) {
      deleteCategory(cat);
      toast.success(`Category "${cat}" deleted`);
    }
  };

  const handleAddCat = () => {
    if (newCatName.trim()) {
      addCategory(newCatName.trim());
      setNewCatName("");
      toast.success(`Category "${newCatName}" added!`);
    }
  };

  const handleExportCSV = () => {
    if (!expenses || expenses.length === 0) {
      toast.warning("No expenses to export");
      return;
    }
    exportToCSV(expenses, month);
    toast.success("CSV exported successfully!");
  };

  const handleExportAll = () => {
    if (!expenses || expenses.length === 0) {
      toast.warning("No expenses to export");
      return;
    }
    exportToCSV(expenses);
    toast.success("All expenses exported!");
  };

  return (
    <div className="page-container" style={{ paddingBottom: "120px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <PageHeader title="Preferences" subtitle="Configure your financial environment" />
        {isDirty && (
          <div style={{ 
            background: "rgba(239, 68, 68, 0.1)", 
            color: "var(--danger)", 
            padding: "8px 16px", 
            borderRadius: "12px", 
            fontSize: "12px", 
            fontWeight: "800",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            animation: "pulse 2s infinite"
          }}>
            <AlertCircle size={14} />
            UNSAVED CHANGES
          </div>
        )}
      </div>

      <div className="settings-grid">
        {/* Profile Card */}
        <div className="card settings-card">
          <div className="settings-card-header">
            <User size={20} />
            <h3>Profile</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-profile-info">
              <div className="settings-avatar">
                {currentUser?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="settings-email">{currentUser?.email}</div>
                <div className="settings-label">Account Member</div>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Card */}
        <div className="card settings-card" style={{ overflow: "visible", position: "relative", zIndex: 10 }}>
          <div className="settings-card-header">
            <Palette size={20} />
            <h3>Theme & Localization</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-row">
              <div>
                <div className="settings-item-label">Interface Theme</div>
                <div className="settings-item-desc">Toggle between light and dark visual modes</div>
              </div>
              <button onClick={toggleTheme} className="theme-toggle-btn">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                <span>{isDarkMode ? "Light" : "Dark"}</span>
              </button>
            </div>
            <div className="settings-row">
              <div>
                <div className="settings-item-label">Primary Currency</div>
                <div className="settings-item-desc">Currency symbol used for all transactions</div>
              </div>
              <div style={{ width: "140px" }}>
                <CustomDropdown
                  options={["$ USD", "€ EUR", "£ GBP", "₹ INR", "¥ JPY"]}
                  value={
                    currency === "$" ? "$ USD" :
                    currency === "€" ? "€ EUR" :
                    currency === "£" ? "£ GBP" :
                    currency === "₹" ? "₹ INR" : "¥ JPY"
                  }
                  onChange={(val) => setCurrency(val.split(' ')[0])}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Budget Settings Card */}
        <div className="card settings-card">
          <div className="settings-card-header">
            <DollarSign size={20} />
            <h3>Budget Allocation</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-row">
              <div>
                <div className="settings-item-label">Global Monthly Budget</div>
                <div className="settings-item-desc">Total spending limit across all categories</div>
              </div>
              <div className="settings-input-group">
                <span className="settings-input-prefix">{currency}</span>
                <input
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  style={{ width: "120px", paddingLeft: "30px" }}
                />
              </div>
            </div>

            <div className="settings-divider" />

            <div className="settings-row" style={{ marginBottom: "16px" }}>
              <div>
                <div className="settings-item-label">Custom Categories</div>
                <div className="settings-item-desc">Create personalized expense tags</div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="name..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  style={{ width: "120px" }}
                />
                <button onClick={handleAddCat} className="btn-save-settings" style={{ minWidth: "auto", padding: "8px 12px" }}>Add</button>
              </div>
            </div>

            <div className="settings-item-label" style={{ marginBottom: "12px" }}>Category-Specific Limits</div>
            <div className="category-budgets-grid" style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
              gap: "12px",
              maxHeight: "380px",
              overflowY: "auto",
              paddingRight: "8px"
            }}>
            {categories.map((cat) => {
                return (
                <div key={cat} className="category-budget-item" style={{ position: "relative" }}>
                  <div className="category-budget-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {getCategoryIcon(cat)}
                      <span style={{ fontSize: "13px" }}>{cat}</span>
                    </div>
                    {deleteCategory && (
                      <button
                        onClick={() => handleDeleteCat(cat)}
                        title="Delete this category"
                        style={{
                          background: "rgba(239, 68, 68, 0.08)",
                          border: "1px solid rgba(239, 68, 68, 0.15)",
                          color: "#ef4444",
                          borderRadius: "6px",
                          padding: "3px 6px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          flexShrink: 0
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                  <div className="settings-input-group">
                    <span className="settings-input-prefix">{currency}</span>
                    <input
                      type="number"
                      value={categoryBudgets[cat] || ""}
                      onChange={(e) =>
                        setCategoryBudgets((prev) => ({
                          ...prev,
                          [cat]: e.target.value,
                        }))
                      }
                      placeholder="0"
                      style={{ width: "100%", paddingLeft: "30px" }}
                    />
                  </div>
                </div>
                );
              })}
            </div>
            <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
              <button 
                onClick={handleSave} 
                className="btn-primary"
                disabled={!isDirty}
                style={{ 
                  padding: "12px 24px", 
                  borderRadius: "12px", 
                  boxShadow: isDirty ? "0 10px 20px var(--primary-glow)" : "none",
                  opacity: isDirty ? 1 : 0.7,
                  background: isDirty ? "var(--primary)" : "var(--bg-card)",
                  color: isDirty ? "white" : "var(--text-muted)",
                  border: isDirty ? "none" : "1px solid var(--border)",
                  transform: isDirty ? "scale(1.02)" : "scale(1)",
                  fontSize: "14px",
                  fontWeight: "800",
                  width: "auto",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
              >
                {isDirty ? (
                  <>
                    <Save size={16} />
                    Update Preferences
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Up to Date
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Alerts Card */}
        <div className="card settings-card">
          <div className="settings-card-header">
            <Bell 
              size={20} 
              color={Number(alertThreshold) > 90 ? "var(--danger)" : Number(alertThreshold) > 75 ? "var(--warning)" : "var(--primary)"} 
            />
            <h3>System Notifications</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-row" style={{ flexDirection: "column", alignItems: "stretch", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div className="settings-item-label">Budget Proximity Alert</div>
                  <div className="settings-item-desc" style={{ marginTop: "4px" }}>Threshold for visual spending warnings</div>
                </div>
                <div style={{ 
                  background: Number(alertThreshold) > 90 ? "rgba(239, 68, 68, 0.1)" : Number(alertThreshold) > 75 ? "rgba(245, 158, 11, 0.1)" : "rgba(217, 70, 239, 0.1)", 
                  color: Number(alertThreshold) > 90 ? "var(--danger)" : Number(alertThreshold) > 75 ? "var(--warning)" : "var(--primary)",
                  padding: "6px 14px", 
                  borderRadius: "20px", 
                  fontWeight: "800",
                  fontSize: "14px",
                  border: `1px solid ${Number(alertThreshold) > 90 ? "rgba(239, 68, 68, 0.2)" : Number(alertThreshold) > 75 ? "rgba(245, 158, 11, 0.2)" : "rgba(217, 70, 239, 0.2)"}`
                }}>
                  {alertThreshold}%
                </div>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                style={{ 
                  margin: "6px 0",
                  width: "100%", 
                  cursor: "pointer", 
                  accentColor: Number(alertThreshold) > 90 ? "var(--danger)" : Number(alertThreshold) > 75 ? "var(--warning)" : "var(--primary)",
                  height: "6px"
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", padding: "0 6px" }}>
                <span>Conservative (50%)</span>
                <span>Standard (75%)</span>
                <span>Maximized (100%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Export Card */}
        <div className="card settings-card">
          <div className="settings-card-header">
            <Download size={20} />
            <h3>Data Management</h3>
          </div>
          <div className="settings-card-body">
            <div className="export-buttons">
              <button onClick={handleExportCSV} className="btn-export">
                <Download size={16} />
                Export {formatPeriodLabel(month)}
              </button>
              <button onClick={handleExportAll} className="btn-export btn-export-secondary">
                <Download size={16} />
                Full CSV Backup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
