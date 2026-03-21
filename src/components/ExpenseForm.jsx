import { useState } from "react";

function ExpenseForm({ addExpense }) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");
    const [date, setDate] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !amount || !category) {
            return alert("Please fill all required fields (name, amount, category)");
        }

        // If user didn't select a date, use today's date
        const expenseDate = date || new Date().toISOString().slice(0, 10); // YYYY-MM-DD

        addExpense({
            id: Date.now(),
            name,
            amount: parseFloat(amount),
            category,
            date: expenseDate,
        });

        // Clear form after adding
        setName("");
        setAmount("");
        setCategory("Food");
        setDate("");
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
            <input
                type="text"
                placeholder="Expense Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ marginRight: "10px" }}
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                style={{ marginRight: "10px" }}
            />
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ marginRight: "10px" }}
            >
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
            </select>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ marginRight: "10px" }}
            />
            <button type="submit">Add Expense</button>
        </form>
    );
}

export default ExpenseForm;
