import { useState } from "react";
import { X } from "lucide-react";
import { getCategoryIcon } from "../utils/categoryIcons";
import CustomDropdown from "./CustomDropdown";

function EditExpenseModalContent({ expense, onSave, onClose, categories = [], deleteCategory }) {
  const [name, setName] = useState(expense.name || "");
  const [amount, setAmount] = useState(expense.amount || "");
  const [category, setCategory] = useState(expense.category || "Food");
  const [date, setDate] = useState(expense.date || "");

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

  const categoryOptions = categories.length > 0
    ? categories
    : ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Education", "Housing", "Work", "Other"];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Transaction</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Transaction Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Amount</label>
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
            <CustomDropdown
              options={categoryOptions}
              value={category}
              onChange={(val) => setCategory(val)}
              onDelete={(cat) => {
                if (window.confirm(`Delete category "${cat}"?`)) {
                  if (deleteCategory) deleteCategory(cat);
                }
              }}
              icon={getCategoryIcon(category)}
              searchable={true}
            />
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditExpenseModal({ expense, onSave, onClose, categories = [], deleteCategory }) {
  if (!expense) return null;

  return (
    <EditExpenseModalContent
      key={expense.id}
      expense={expense}
      onSave={onSave}
      onClose={onClose}
      categories={categories}
      deleteCategory={deleteCategory}
    />
  );
}

export default EditExpenseModal;
