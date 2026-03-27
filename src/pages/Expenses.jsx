import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../components/PageHeader";
import ExpenseForm from "../components/ExpenseForm";
import EditExpenseModal from "../components/EditExpenseModal";
import EmptyState from "../components/EmptyState";
import { getCategoryIcon } from "../utils/categoryIcons";
import { useToast } from "../contexts/ToastContext";
import { 
    Search, 
    Pencil, 
    Trash2, 
    RefreshCw, 
    Download, 
    Layers, 
    Plus,
    X,
    Filter,
    Activity,
    Check
} from "lucide-react";
import { exportToCSV } from "../utils/exportCSV";

function Expenses({ expenses = [], addExpense, editExpense, deleteExpense, deleteMultipleExpenses, deleteAllExpenses, categories = [], addCategory, category, setCategory, month, setMonth, currency = "$" }) {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("date-desc");
    const [selectedIds, setSelectedIds] = useState([]);
    const [editingExpense, setEditingExpense] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const toast = useToast();

    // Keyboard shortcut: N to open form
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "n" && !e.ctrlKey && !e.metaKey && !e.altKey) {
                const active = document.activeElement;
                const isInput = active?.tagName === "INPUT" || active?.tagName === "TEXTAREA" || active?.tagName === "SELECT";
                if (!isInput && !editingExpense) {
                    e.preventDefault();
                    setShowForm(true);
                    setTimeout(() => {
                        document.querySelector('.expense-form-card input[type="text"]')?.focus();
                    }, 100);
                }
            }
            if (e.key === "Escape") {
                setShowForm(false);
                setEditingExpense(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [editingExpense]);

    // Filtering logic
    const filteredExpenses = expenses.filter((exp) => {
        const matchesMonth = exp.date?.slice(0, 7) === month;
        const matchesCategory = category === "All" || exp.category === category;
        const matchesSearch = exp.name?.toLowerCase().includes(search.toLowerCase());
        return matchesMonth && matchesCategory && matchesSearch;
    });

    // Sorting logic
    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
        if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
        if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
        if (sortBy === "amount-desc") return Number(b.amount) - Number(a.amount);
        if (sortBy === "amount-asc") return Number(a.amount) - Number(b.amount);
        return 0;
    });

    const monthlyTotalForFiltered = filteredExpenses.reduce((total, exp) => total + Number(exp.amount), 0);

    const handleToggleSelection = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === sortedExpenses.length && sortedExpenses.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(sortedExpenses.map(e => e.id));
        }
    };

    const handleDeleteSelected = () => {
        if (selectedIds.length === 0) return;
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected transactions?`)) {
            deleteMultipleExpenses(selectedIds);
            toast.success(`Deleted ${selectedIds.length} transactions`);
            setSelectedIds([]);
        }
    };

    const handleAdd = (expense) => {
        addExpense(expense);
        toast.success("Expense added successfully!");
        setShowForm(false);
    };

    const handleEdit = (id, updatedData) => {
        editExpense(id, updatedData);
        toast.success("Expense updated!");
        setEditingExpense(null);
    };

    const handleDelete = (id) => {
        deleteExpense(id);
        toast.success("Expense deleted");
        // Remove from selection if it was selected
        setSelectedIds(prev => prev.filter(i => i !== id));
    };

    const handleDeleteAll = () => {
        if (expenses.length === 0) {
            toast.warning("No transactions to delete");
            return;
        }

        if (window.confirm("ARE YOU ABSOLUTELY SURE? This will permanently delete ALL transactions for this account across ALL months. This cannot be undone.")) {
            deleteAllExpenses();
            toast.success("All transactions deleted successfully!");
            setSelectedIds([]);
        }
    };

    const handleExport = () => {
        if (filteredExpenses.length === 0) {
            toast.warning("No expenses to export");
            return;
        }
        exportToCSV(filteredExpenses);
        toast.success("CSV exported!");
    };

    return (
        <div className="page-container">
            <div className="page-header-row" style={{ alignItems: "center", marginBottom: "32px" }}>
                <div style={{ flex: 1 }}>
                    <PageHeader title="Transactions" subtitle="Detailed breakdown of your spending habits." />
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <button
                        onClick={handleDeleteAll}
                        style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "10px", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.1)" }}
                        title="Delete All"
                        disabled={expenses.length === 0}
                    >
                        <Trash2 size={18} />
                    </button>
                    <button 
                        onClick={handleExport} 
                        style={{ background: "rgba(var(--bg-card-rgb), 0.5)", border: "1px solid var(--border)", color: "var(--text-main)", padding: "10px", borderRadius: "12px" }}
                        title="Export CSV"
                    >
                        <Download size={18} />
                    </button>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary"
                        style={{ 
                            padding: "10px 20px", 
                            background: showForm ? "var(--danger)" : "var(--primary)",
                            boxShadow: !showForm ? "0 10px 20px var(--primary-glow)" : "none",
                            borderRadius: "14px",
                            transform: "scale(1.05)"
                        }}
                    >
                        {showForm ? <><X size={18} /> Close</> : <><Plus size={18} /> Add New</>}
                    </button>
                </div>
            </div>
            {/* Keyboard shortcut hint */}
            <div style={{ marginBottom: "24px", textAlign: "center" }}>
                <span className="keyboard-hint" style={{ background: "rgba(var(--bg-card-rgb), 0.8)", border: "1px solid var(--border)", color: "var(--text-main)", padding: "10px 20px", borderRadius: "30px", fontSize: "12px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "var(--primary)", fontWeight: "900" }}>PRO TIP:</span> Press <kbd style={{ background: "var(--primary)", color: "white", padding: "2px 8px", borderRadius: "6px", margin: "0 2px" }}>N</kbd> to quick-add • <kbd style={{ background: "var(--border)", color: "var(--text-main)", padding: "2px 8px", borderRadius: "6px", margin: "0 2px" }}>Esc</kbd> to exit
                </span>
            </div>

            {/* Add Expense Form - Collapsible */}
            {showForm && (
                <div className="card glass expense-form-card" style={{ marginBottom: "32px", border: "1px solid var(--primary-glow)", background: "rgba(var(--primary-rgb), 0.02)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                        <div style={{ background: "var(--primary)", color: "white", padding: "6px", borderRadius: "8px" }}>
                            <Plus size={16} />
                        </div>
                        <h3 className="card-label" style={{ margin: 0, fontSize: "14px", letterSpacing: "1px" }}>Transaction Builder</h3>
                    </div>
                    <ExpenseForm addExpense={handleAdd} categories={categories} addCategory={addCategory} />
                </div>
            )}

            {/* Controls Section */}
            <div className="card glass" style={{ marginBottom: "32px", padding: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                    <Filter size={18} color="var(--primary)" />
                    <h3 className="card-label" style={{ margin: 0 }}>Filter & Sort</h3>
                </div>
                
                <div className="expense-controls-grid" style={{ gap: "24px" }}>
                    {/* Month Picker */}
                    <div>
                        <label className="card-label" style={{ marginBottom: "8px", display: "block" }}>Period</label>
                        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} style={{ background: "rgba(0,0,0,0.02)" }} />
                    </div>

                    {/* Category Filter */}
                    <div>
                        <label className="card-label" style={{ marginBottom: "8px", display: "block" }}>Category</label>
                        <div style={{ position: "relative" }}>
                            <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", zIndex: 1, display: "flex" }}>{getCategoryIcon(category)}</div>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ paddingLeft: "42px", appearance: "none", background: "rgba(0,0,0,0.02)" }}>
                                <option value="All">All Transactions</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Sorting */}
                    <div>
                        <label className="card-label" style={{ marginBottom: "8px", display: "block" }}>Order</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ background: "rgba(0,0,0,0.02)" }}>
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="amount-desc">High to Low</option>
                            <option value="amount-asc">Low to High</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginTop: "32px", position: "relative" }}>
                    <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                    <input
                        type="text"
                        placeholder="Search by vendor or item name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ 
                            paddingLeft: "48px", 
                            background: "rgba(var(--bg-card-rgb), 0.3)", 
                            borderRadius: "14px",
                            height: "52px",
                            fontSize: "15px",
                            fontWeight: "600"
                        }}
                    />
                </div>
            </div>

            {/* Summary Highlights */}
            <div className="glass" style={{ 
                marginBottom: "32px", 
                padding: "20px 28px", 
                borderRadius: "20px", 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                border: "1px solid var(--border)",
                background: "linear-gradient(90deg, rgba(var(--primary-rgb), 0.05) 0%, transparent 100%)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Layers size={18} color="var(--primary)" />
                    <span style={{ fontSize: "14px", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
                        Results: <span style={{ color: "var(--text-main)" }}>{sortedExpenses.length}</span>
                    </span>
                </div>
                <div style={{ fontSize: "22px", fontWeight: "900", color: "var(--primary)", letterSpacing: "-0.04em" }}>
                    Total: {currency}{monthlyTotalForFiltered.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
            </div>

            {/* Expense List */}
            <div className="card glass" style={{ position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Activity size={18} color="var(--primary)" />
                        <h3 className="card-label" style={{ margin: 0 }}>Transaction Ledger</h3>
                    </div>
                    {sortedExpenses.length > 0 && (
                        <button 
                            onClick={handleSelectAll}
                            style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "12px", fontWeight: "800", cursor: "pointer", padding: "4px 8px" }}
                        >
                            {selectedIds.length === sortedExpenses.length ? "DESELECT ALL" : "SELECT ALL"}
                        </button>
                    )}
                </div>

                {sortedExpenses.length === 0 ? (
                    <EmptyState
                        type="search"
                        title={search ? "We couldn't find any matches" : "No Ledger Entries Found"}
                        subtitle={search ? "Try refining your keywords or clearing filters." : "You haven't added any spending data for this period yet."}
                        action={!search ? { label: "Add Your First Expense", onClick: () => setShowForm(true) } : undefined}
                    />
                ) : (
                    <>
                        <ul className="expense-list" style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: selectedIds.length > 0 ? "80px" : "0" }}>
                            {sortedExpenses.map((exp) => (
                                <li key={exp.id} className={`expense-item ${selectedIds.includes(exp.id) ? 'selected' : ''}`} style={{ background: "rgba(var(--bg-card-rgb), 0.5)", border: "1px solid var(--border)", position: "relative" }}>
                                    <div className="expense-item-left">
                                        <div 
                                            onClick={() => handleToggleSelection(exp.id)}
                                            style={{ 
                                                cursor: "pointer", 
                                                marginRight: "16px",
                                                padding: "4px",
                                                borderRadius: "6px",
                                                border: `2px solid ${selectedIds.includes(exp.id) ? 'var(--primary)' : 'var(--border)'}`,
                                                background: selectedIds.includes(exp.id) ? 'var(--primary)' : 'transparent',
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: "20px",
                                                height: "20px",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            {selectedIds.includes(exp.id) && <Check size={14} color="white" />}
                                        </div>
                                        <div className="expense-icon-box" style={{ background: "var(--bg-app)" }}>
                                            {getCategoryIcon(exp.category)}
                                        </div>
                                        <div className="expense-item-info">
                                            <strong className="expense-item-name" style={{ fontSize: "16px", fontWeight: "800" }}>{exp.name}</strong>
                                            <span className="expense-item-meta" style={{ fontWeight: "600", color: "var(--text-muted)" }}>
                                                {exp.category} • {exp.date}
                                                {exp.isRecurring && <span className="recurring-badge" style={{ background: "rgba(124, 58, 237, 0.1)", color: "#7c3aed" }}><RefreshCw size={10} /> RECURRING</span>}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="expense-item-right" style={{ gap: "24px" }}>
                                        <div className="expense-item-amount" style={{ fontSize: "18px", fontWeight: "900", color: "var(--text-main)" }}>
                                            {currency}{Number(exp.amount).toFixed(2)}
                                        </div>
                                        <div className="expense-item-actions">
                                            <button
                                                onClick={() => setEditingExpense(exp)}
                                                style={{ background: "rgba(var(--primary-rgb), 0.1)", color: "var(--primary)", border: "none" }}
                                                className="btn-action"
                                                title="Edit"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exp.id)}
                                                style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none" }}
                                                className="btn-action"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Multi-select bottom bar */}
                        {selectedIds.length > 0 && (
                            <div style={{ 
                                position: "sticky", 
                                bottom: "24px", 
                                left: "24px",
                                right: "24px",
                                background: "var(--bg-sidebar)",
                                color: "white",
                                padding: "16px 24px",
                                borderRadius: "18px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                                animation: "fadeIn 0.3s ease-out",
                                zIndex: 10
                            }}>
                                <div style={{ fontWeight: "800", fontSize: "14px" }}>
                                    {selectedIds.length} items selected
                                </div>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    <button 
                                        onClick={() => setSelectedIds([])}
                                        style={{ background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.2)", padding: "10px 18px", borderRadius: "12px", cursor: "pointer", fontWeight: "800" }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleDeleteSelected}
                                        style={{ background: "#ef4444", color: "white", border: "none", padding: "10px 18px", borderRadius: "12px", cursor: "pointer", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}
                                    >
                                        <Trash2 size={16} /> Delete Selected
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>


            {/* Edit Modal */}
            <EditExpenseModal
                expense={editingExpense}
                onSave={handleEdit}
                onClose={() => setEditingExpense(null)}
            />
        </div>
    );
}

export default Expenses;
