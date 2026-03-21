function ExpenseItem({ expense, deleteExpense }) {
    return (
        <li className="expense-item">
            <div>
                <p className="expense-title">{expense.title}</p>
                <span className={`badge ${expense.category.toLowerCase()}`}>
                    {expense.category}
                </span>
            </div>

            <div className="right">
                <p className="amount">₹{expense.amount}</p>
                <button onClick={() => deleteExpense(expense.id)}>✕</button>
            </div>
        </li>
    );
}

export default ExpenseItem;
