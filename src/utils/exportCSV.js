import { isDateInPeriod } from "./dateUtils";

export function exportToCSV(expenses, monthFilter) {
  if (!expenses || expenses.length === 0) return;

  // Filter based on the selected month/period (if any)
  const filtered = monthFilter && monthFilter !== "All"
    ? expenses.filter((exp) => isDateInPeriod(exp.date, monthFilter))
    : expenses;

  if (filtered.length === 0) return;

  // 1. Sort expenses by date (Newest first or Oldest first? User said date wise, usually Oldest to Newest for reports)
  const sorted = [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date));

  const headers = ["Name", "Amount", "Category", "Date", "Recurring"];
  const rows = [];
  
  let currentMonth = "";
  let monthTotal = 0;
  let overallTotal = 0;

  sorted.forEach((exp, index) => {
    const expMonth = exp.date?.slice(0, 7) || "Misc";
    const amt = Number(exp.amount) || 0;

    // 2. Add Month Headers for "All" export or when month changes
    if (expMonth !== currentMonth) {
      // If we are transitioning from one month to another, add subtotal for the previous month
      if (currentMonth !== "" && !monthFilter) {
        rows.push(["", "", "", "", ""]);
        rows.push([`"Month Subtotal (${currentMonth})"`, monthTotal.toFixed(2), "", "", ""]);
        rows.push(["", "", "", "", ""]);
        monthTotal = 0;
      }
      
      // Add the new month header
      rows.push([`"--- SPENDING FOR ${expMonth.toUpperCase()} ---"`, "", "", "", ""]);
      currentMonth = expMonth;
    }

    // Push the transaction row
    rows.push([
      `"${exp.name?.replace(/"/g, '""') || ""}"`,
      amt,
      `"${exp.category || ""}"`,
      `'${exp.date || ""}`, // Prefix with single quote to force text in Excel (no ### anymore!)
      exp.isRecurring ? "Yes" : "No"
    ]);

    monthTotal += amt;
    overallTotal += amt;

    // If it's the very last item, add the final subtotal if we are in "All" mode
    if (index === sorted.length - 1 && !monthFilter) {
      rows.push(["", "", "", "", ""]);
      rows.push([`"Month Subtotal (${currentMonth})"`, monthTotal.toFixed(2), "", "", ""]);
    }
  });

  // 3. Final Overall Summary
  rows.push(["", "", "", "", ""]);
  rows.push(["", "", "", "", ""]);
  rows.push([`"FINAL GRAND TOTAL"`, overallTotal.toFixed(2), "", "", ""]);

  // BOM (Byte Order Mark) for Excel to open UTF-8 correctly
  const csvContent = "\ufeff" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `expenses_${monthFilter || "full_ledger"}.csv`);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
