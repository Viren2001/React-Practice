import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../components/PageHeader";
import ExpenseForm from "../components/ExpenseForm";
import EditExpenseModal from "../components/EditExpenseModal";
import EmptyState from "../components/EmptyState";
import { getCategoryIcon } from "../utils/categoryIcons";
import { useToast } from "../contexts/ToastContext";
import { Search, Pencil, Trash2, RefreshCw, Download } from "lucide-react";
import { exportToCSV } from "../utils/exportCSV";

function Expenses({ expenses = [], addExpense, editExpense, deleteExpense, category, setCategory, month, setMonth, currency = "$" }) {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("date-desc");
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
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div className="page-header-row">
                <PageHeader title="Expenses" subtitle="Manage and track your detailed spending" />
                <div className="page-header-actions">
                    <button onClick={handleExport} className="btn-icon" title="Export CSV">
                        <Download size={18} />
                    </button>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary btn-add-expense"
                    >
                        {showForm ? "Cancel" : "+ Add"}
                    </button>
                </div>
            </div>

            {/* Keyboard shortcut hint */}
            <div className="keyboard-hint">
                Press <kbd>N</kbd> to quick-add • <kbd>Esc</kbd> to close
            </div>

            {/* Add Expense Form - Collapsible */}
            {showForm && (
                <div className="card expense-form-card" style={{ marginBottom: "24px" }}>
                    <h3 style={{ marginBottom: "20px", fontSize: "16px", color: "var(--text-main)" }}>New Expense</h3>
                    <ExpenseForm addExpense={handleAdd} />
                </div>
            )}

            {/* Controls Section */}
            <div className="card" style={{ marginBottom: "24px" }}>
                <div className="expense-controls-grid">
                    {/* Month Picker */}
                    <div>
                        <label className="control-label">Month</label>
                        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
                    </div>

                    {/* Category Filter */}
                    <div>
                        <label className="control-label">Category</label>
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                            <div style={{ position: "absolute", left: "12px", color: "var(--text-muted)", display: "flex" }}>{getCategoryIcon(category)}</div>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ paddingLeft: "38px", appearance: "none" }}>
                                <option value="All">All Categories</option>
                                <option value="Food">Food</option>
                                <option value="Transport">Transport</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Bills">Bills</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Sorting */}
                    <div>
                        <label className="control-label">Sort By</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="amount-desc">Highest Amount</option>
                            <option value="amount-asc">Lowest Amount</option>
                        </select>
                    </div>
                </div>

                {/* Search Bar */}
                <div style={{ marginTop: "20px", position: "relative" }}>
                    <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input 
                        type="text" 
                        placeholder="Search expenses by name..." 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: "40px" }}
                    />
                </div>
            </div>

            {/* Summary Highlights */}
            <div className="expense-summary-row">
                <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}>
                    Found {sortedExpenses.length} transaction{sortedExpenses.length !== 1 ? 's' : ''}
                </div>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--primary)" }}>
                    Total: {currency}{monthlyTotalForFiltered.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
            </div>

            {/* Expense List */}
            <div className="card">
                <h3 style={{ marginBottom: "20px", fontSize: "16px", color: "var(--text-main)" }}>History</h3>
                {sortedExpenses.length === 0 ? (
                    <EmptyState
                        type="search"
                        title="No expenses found"
                        subtitle={search ? "Try adjusting your search or filters" : "Start by adding your first expense for this month"}
                        action={!search ? { label: "Add Expense", onClick: () => setShowForm(true) } : undefined}
                    />
                ) : (
                    <ul className="expense-list">
                        {sortedExpenses.map((exp) => (
                            <li key={exp.id} className="expense-item">
                                <div className="expense-item-left">
                                    <div className="expense-icon-box">
                                        {getCategoryIcon(exp.category)}
                                    </div>
                                    <div className="expense-item-info">
                                        <strong className="expense-item-name">{exp.name}</strong>
                                        <span className="expense-item-meta">
                                            {exp.category} • {exp.date}
                                            {exp.isRecurring && <span className="recurring-badge"><RefreshCw size={10} /> Recurring</span>}
                                        </span>
                                    </div>
                                </div>
                                <div className="expense-item-right">
                                    <div className="expense-item-amount">
                                        {currency}{Number(exp.amount).toFixed(2)}
                                    </div>
                                    <div className="expense-item-actions">
                                        <button
                                            onClick={() => setEditingExpense(exp)}
                                            className="btn-action btn-edit"
                                            title="Edit"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exp.id)}
                                            className="btn-action btn-delete"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
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
