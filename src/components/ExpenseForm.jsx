import { useState } from "react";
import { getCategoryIcon } from "../utils/categoryIcons";

function ExpenseForm({ addExpense }) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !amount || !category) {
            return alert("Please fill all required fields (name, amount, category)");
        }

        addExpense({
            id: Date.now(),
            name,
            amount: parseFloat(amount),
            category,
            date: date || new Date().toISOString().slice(0, 10),
        });

        setName("");
        setAmount("");
        setCategory("Food");
        setDate(new Date().toISOString().slice(0, 10));
    };

    return (
        <form onSubmit={handleSubmit} style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "20px",
            alignItems: "end"
        }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Expense Name</label>
                <input
                    type="text"
                    placeholder="e.g. Starbucks Coffee"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Amount ($)</label>
                <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Category</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <div style={{ 
                        position: "absolute", 
                        left: "14px", 
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center"
                    }}>
                        {getCategoryIcon(category)}
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ paddingLeft: "42px", appearance: "none" }}
                    >
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Bills">Bills</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>
            <button 
                type="submit" 
                style={{ 
                    backgroundColor: "var(--primary)", 
                    color: "white", 
                    boxShadow: "0 4px 12px var(--primary-glow)",
                    height: "46px" 
                }}
            >
                Add Transaction
            </button>
        </form>
    );
}

export default ExpenseForm;
