function ExpenseFilter({ setCategory }) {
    
  return (
    <select onChange={(e) => setCategory(e.target.value)}>
      <option>All</option>
      <option>Food</option>
      <option>Travel</option>
      <option>Shopping</option>
      <option>Bills</option>
    </select>
  );
}

export default ExpenseFilter;
