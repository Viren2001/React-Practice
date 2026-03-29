import React, { useState, useEffect } from "react";
import CustomDropdown from "../components/CustomDropdown";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { Sun, Moon, Download, Save, User, Palette, Bell, DollarSign } from "lucide-react";
import { getCategoryIcon } from "../utils/categoryIcons";
import { exportToCSV } from "../utils/exportCSV";

function Settings({ expenses = [], month, categories = [], addCategory }) {
  const { currentUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const toast = useToast();

  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [currency, setCurrency] = useState("$");
  const [settingsDocId, setSettingsDocId] = useState(null);
  const [newCatName, setNewCatName] = useState("");

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
        setMonthlyBudget(data.monthlyBudget || 0);
        setCategoryBudgets(data.categoryBudgets || {});
        setAlertThreshold(data.alertThreshold || 80);
        setCurrency(data.currency || "$");
      }
    });

    return unsubscribe;
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser) return;
    try {
      const settingsData = {
        userId: currentUser.uid,
        monthlyBudget: Number(monthlyBudget),
        categoryBudgets,
        alertThreshold: Number(alertThreshold),
        currency,
        categories, // Include the current categories list
        updatedAt: Date.now(),
      };

      if (settingsDocId) {
        await updateDoc(doc(db, "settings", settingsDocId), settingsData);
      } else {
        settingsData.createdAt = Date.now();
        await addDoc(collection(db, "settings"), settingsData);
      }
      toast.success("Settings saved successfully!");
    } catch (err) {
      toast.error("Failed to save settings");
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
    <div className="page-container">
      <PageHeader title="Settings" subtitle="Configure your preferences and budgets" />

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
                <div className="settings-label">Account Email</div>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Card */}
        <div className="card settings-card" style={{ overflow: "visible", position: "relative", zIndex: 10 }}>
          <div className="settings-card-header">
            <Palette size={20} />
            <h3>Appearance</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-row">
              <div>
                <div className="settings-item-label">Theme</div>
                <div className="settings-item-desc">Switch between light and dark mode</div>
              </div>
              <button onClick={toggleTheme} className="theme-toggle-btn">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                <span>{isDarkMode ? "Light" : "Dark"}</span>
              </button>
            </div>
            <div className="settings-row">
              <div>
                <div className="settings-item-label">Currency</div>
                <div className="settings-item-desc">Display currency symbol</div>
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
            <h3>Budget & Categories</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-row">
              <div>
                <div className="settings-item-label">Monthly Budget</div>
                <div className="settings-item-desc">Total spending limit per month</div>
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
                <div className="settings-item-label">Add Category</div>
                <div className="settings-item-desc">Create a new custom category</div>
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

            <div className="settings-item-label" style={{ marginBottom: "12px" }}>Category Budgets</div>
            <div className="category-budgets-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {categories.map((cat) => (
                <div key={cat} className="category-budget-item">
                  <div className="category-budget-label">
                    {getCategoryIcon(cat)}
                    <span style={{ fontSize: "13px" }}>{cat}</span>
                  </div>
                  <div className="settings-input-group">
                    <span className="settings-input-prefix">{currency}</span>
                    <input
                      type="number"
                      value={categoryBudgets[cat] || ""}
                      onChange={(e) =>
                        setCategoryBudgets((prev) => ({
                          ...prev,
                          [cat]: Number(e.target.value),
                        }))
                      }
                      placeholder="0"
                      style={{ width: "100%", paddingLeft: "30px" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts Card */}
        <div className="card settings-card">
          <div className="settings-card-header">
            <Bell size={20} />
            <h3>Alerts</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-row">
              <div>
                <div className="settings-item-label">Alert Threshold</div>
                <div className="settings-item-desc">Get warned when spending reaches this % of budget</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  style={{ width: "100px" }}
                />
                <span style={{ fontWeight: "700", fontSize: "14px", minWidth: "40px" }}>{alertThreshold}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Export Card */}
        <div className="card settings-card">
          <div className="settings-card-header">
            <Download size={20} />
            <h3>Export Data</h3>
          </div>
          <div className="settings-card-body">
            <div className="export-buttons">
              <button onClick={handleExportCSV} className="btn-export">
                <Download size={16} />
                Export Current Month
              </button>
              <button onClick={handleExportAll} className="btn-export btn-export-secondary">
                <Download size={16} />
                Export All Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-save-container">
        <button onClick={handleSave} className="btn-primary btn-save-settings">
          <Save size={18} />
          Save All Settings
        </button>
      </div>
    </div>
  );
}

export default Settings;
