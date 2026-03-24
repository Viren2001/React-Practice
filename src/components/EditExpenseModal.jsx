import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getCategoryIcon } from "../utils/categoryIcons";

function EditExpenseModal({ expense, onSave, onClose }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (expense) {
      setName(expense.name || "");
      setAmount(expense.amount || "");
      setCategory(expense.category || "Food");
      setDate(expense.date || "");
    }
  }, [expense]);

  if (!expense) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    onSave(expense.id, {
      name,
      amount: parseFloat(amount),
      category,
      date,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Expense</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Expense Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <div style={{ position: "absolute", left: "14px", color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
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
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditExpenseModal;
