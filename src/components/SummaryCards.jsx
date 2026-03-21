// function SummaryCards({ expenses }) {
//     const total = expenses.reduce((sum, e) => sum + e.amount, 0);

//     const categoryTotals = expenses.reduce((acc, e) => {
//         acc[e.category] = (acc[e.category] || 0) + e.amount;
//         return acc;
//     }, {});

//     const topCategory =
//         Object.entries(categoryTotals).length > 0
//             ? Object.entries(categoryTotals).reduce((a, b) =>
//                 a[1] > b[1] ? a : b
//             )
//             : null;

//     return (
//         <div className="summary-cards">
//             <div className="card">
//                 <h3>Total Spent</h3>
//                 <p>₹{total}</p>
//             </div>

//             <div className="card">
//                 <h3>🔥 Top Category</h3>

//                 <p>
//                     {topCategory
//                         ? `${topCategory[0]} (₹${topCategory[1]})`
//                         : "—"}
//                 </p>
//             </div>

//             <div className="card">
//                 <h3>Total Expenses</h3>
//                 <p>{expenses.length}</p>
//             </div>
//         </div>
//     );
// }

// export default SummaryCards;
