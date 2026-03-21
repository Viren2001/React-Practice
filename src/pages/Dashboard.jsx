import React from "react";
import PageHeader from "../components/PageHeader";

const cardStyle = {
    padding: "20px",
    marginBottom: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

function Dashboard({ expenses = [], month, setMonth }) {
    // Filter expenses for selected month
    const monthlyExpenses = expenses.filter((exp) => exp.date?.slice(0, 7) === month);

    // Total for selected month
    const monthTotal = monthlyExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    return (
        <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
            <PageHeader title="Dashboard" subtitle="Overview of your monthly expenses" />

            {/* Month Selector */}
            <div style={cardStyle}>
                <label>
                    Select Month:{" "}
                    <input
                        type="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)} // ✅ update state
                    />
                </label>
            </div>

            {/* Monthly Total */}
            <div style={cardStyle}>
                <h3>Total Expenses for {month}</h3>
                <p style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}>
                    ${monthTotal.toFixed(2)}
                </p>
            </div>

            {/* Recent Expenses */}
            {monthlyExpenses.length > 0 && (
                <div style={cardStyle}>
                    <h3>Recent Expenses</h3>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {monthlyExpenses.slice(-5).reverse().map((exp) => (
                            <li key={exp.id} style={{ marginBottom: "10px" }}>
                                <strong>{exp.name}</strong> - ${exp.amount.toFixed(2)} ({exp.category}) on {exp.date}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
