import React from "react";
import PageHeader from "../components/PageHeader";
import ExpenseForm from "../components/ExpenseForm";

// Card style for consistent design
const cardStyle = {
    padding: "20px",
    marginBottom: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

function ExpenseFilter({ category, setCategory }) {
    return (
        <div style={{ marginTop: "10px" }}>
            <label>
                Category:{" "}
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Other">Other</option>
                </select>
            </label>
        </div>
    );
}

function ExpenseList({ expenses, deleteExpense }) {
    if (!expenses || expenses.length === 0) {
        return <p style={{ textAlign: "center" }}>No expenses for this month.</p>;
    }

    return (
        <ul style={{ listStyle: "none", padding: 0 }}>
            {expenses.map((exp) => (
                <li key={exp.id} style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <strong>{exp.name}</strong> - ${exp.amount.toFixed(2)} ({exp.category}) on {exp.date}
                    </div>
                    <button onClick={() => deleteExpense(exp.id)} style={{ backgroundColor: "#f87171", border: "none", padding: "5px 10px", borderRadius: "5px", color: "#fff", cursor: "pointer" }}>
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
}

function Expenses({ expenses = [], addExpense, deleteExpense, category, setCategory, month, setMonth }) {
    const filteredExpenses = category === "All" ? expenses : expenses.filter((e) => e.category === category);
    const filteredByMonth = filteredExpenses.filter((exp) => exp.date?.slice(0, 7) === month);
    const monthlyTotal = expenses
        .filter((exp) => exp.date?.slice(0, 7) === month)
        .reduce((total, exp) => total + Number(exp.amount), 0);


    return (
        <div style={{ padding: "20px", maxWidth: "990px", margin: "0 auto" }}>
            <PageHeader title="Expenses" subtitle="Track your monthly expenses" />

            {/* Month Selector + Monthly Total */}
            <div style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label>
                        Select Month:{" "}
                        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
                    </label>
                    <div style={{ fontWeight: "bold", fontSize: "18px", color: "#2563eb" }}>
                        Total: ${monthlyTotal.toFixed(2)}
                    </div>
                </div>
                <ExpenseFilter category={category} setCategory={setCategory} />
            </div>

            {/* Expense Form */}
            <div style={cardStyle}>
                <ExpenseForm addExpense={addExpense} />

            </div>

            {/* Expenses List */}
            <div style={cardStyle}>
                <ExpenseList expenses={filteredByMonth} deleteExpense={deleteExpense} />
            </div>
        </div>
    );
}

export default Expenses;
