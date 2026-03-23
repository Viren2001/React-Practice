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

        const expenseDate = date || new Date().toISOString().slice(0, 10);

        addExpense({
            id: Date.now(),
            name,
            amount: parseFloat(amount),
            category,
            date: expenseDate,
        });

        setName("");
        setAmount("");
        setCategory("Food");
        setDate("");
    };

    return (
        <form onSubmit={handleSubmit} className="expense-form">
            <input
                type="text"
                placeholder="Expense Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="form-input"
            />
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
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
                className="form-input"
            />
            <button type="submit" className="form-submit-btn">Add Expense</button>
        </form>
    );
}

export default ExpenseForm;
