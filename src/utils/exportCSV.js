export function exportToCSV(expenses, month) {
  if (!expenses || expenses.length === 0) return;

  const filtered = month
    ? expenses.filter((exp) => exp.date?.slice(0, 7) === month)
    : expenses;

  if (filtered.length === 0) return;

  const headers = ["Name", "Amount", "Category", "Date"];
  const rows = filtered.map((exp) => [
    `"${exp.name || ""}"`,
    exp.amount || 0,
    exp.category || "",
    exp.date || "",
  ]);

  const total = filtered.reduce((sum, exp) => sum + Number(exp.amount), 0);
  rows.push(["", "", "", ""]);
  rows.push([`"Total"`, total.toFixed(2), "", ""]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `expenses_${month || "all"}.csv`);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
