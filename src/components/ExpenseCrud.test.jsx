import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";

vi.mock("./CustomDropdown", () => ({
  default: ({ options, value, onChange }) => (
    <select
      aria-label="Category"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}));

describe("Expense CRUD smoke tests", () => {
  it("creates an expense through ExpenseForm", () => {
    const addExpense = vi.fn();

    render(
      <ExpenseForm
        addExpense={addExpense}
        categories={["Food", "Travel"]}
        addCategory={vi.fn()}
        deleteCategory={vi.fn()}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("e.g. Starbucks Coffee"), {
      target: { value: "Lunch" }
    });
    fireEvent.change(screen.getByPlaceholderText("0.00"), {
      target: { value: "12.5" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Transaction" }));

    expect(addExpense).toHaveBeenCalledTimes(1);
    expect(addExpense.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        name: "Lunch",
        amount: 12.5,
        category: "Food"
      })
    );
  });

  it("deletes an expense through ExpenseList item action", () => {
    const deleteExpense = vi.fn();

    render(
      <ExpenseList
        expenses={[
          {
            id: 42,
            title: "Lunch",
            amount: 12.5,
            category: "Food"
          }
        ]}
        deleteExpense={deleteExpense}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "✕" }));
    expect(deleteExpense).toHaveBeenCalledWith(42);
  });
});
