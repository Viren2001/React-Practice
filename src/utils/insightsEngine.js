import { isDateInPeriod } from './dateUtils';

export function generateInsights(expenses, currentMonth, budget, currency) {
    if (!expenses || expenses.length === 0) return [];

    const insights = [];
    const now = new Date();
    
    // 1. Calculate Period Totals
    const currentPeriodExpenses = expenses.filter(exp => isDateInPeriod(exp.date, currentMonth));
    const currentTotal = currentPeriodExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    
    // Parse the current month string (e.g. "2023-10") to get the previous month
    let prevMonthStr = "All";
    if (currentMonth !== "All") {
        const [year, month] = currentMonth.split("-").map(Number);
        let prevYear = year;
        let prevMonth = month - 1;
        if (prevMonth === 0) {
            prevMonth = 12;
            prevYear -= 1;
        }
        prevMonthStr = `${prevYear}-${String(prevMonth).padStart(2, "0")}`;
    }

    const prevPeriodExpenses = expenses.filter(exp => isDateInPeriod(exp.date, prevMonthStr));
    const prevTotal = prevPeriodExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    // Insight 1: Month-over-month comparison
    if (prevTotal > 0 && currentMonth !== "All") {
        const diff = currentTotal - prevTotal;
        const percentChange = (diff / prevTotal) * 100;
        
        if (percentChange > 15) {
            insights.push({
                id: 'mom-up',
                type: 'warning',
                title: 'Spending is up',
                description: `You've spent ${percentChange.toFixed(0)}% more this month compared to last month.`
            });
        } else if (percentChange < -10) {
            insights.push({
                id: 'mom-down',
                type: 'success',
                title: 'Great saving!',
                description: `You've reduced your spending by ${Math.abs(percentChange).toFixed(0)}% compared to last month.`
            });
        }
    }

    // Insight 2: Budget Pacing (Only if viewing current calendar month)
    const isCurrentCalendarMonth = currentMonth === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    if (budget > 0 && isCurrentCalendarMonth) {
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const currentDay = now.getDate();
        const dailyAvg = currentTotal / currentDay;
        const projectedTotal = dailyAvg * daysInMonth;
        
        if (projectedTotal > budget * 1.1) {
            insights.push({
                id: 'budget-pace',
                type: 'warning',
                title: 'Budget Alert',
                description: `At your current rate of ${currency}${dailyAvg.toFixed(0)}/day, you'll exceed your budget by ${currency}${(projectedTotal - budget).toLocaleString(undefined, { maximumFractionDigits: 0 })}.`
            });
        } else if (projectedTotal < budget * 0.9 && currentDay > 5) {
            insights.push({
                id: 'budget-pace-good',
                type: 'success',
                title: 'On track',
                description: `You're on track to save ${currency}${(budget - projectedTotal).toLocaleString(undefined, { maximumFractionDigits: 0 })} by the end of the month.`
            });
        }
    }

    // Insight 3: Largest single expense
    if (currentPeriodExpenses.length > 3) {
        const maxExpense = currentPeriodExpenses.reduce((max, exp) => Number(exp.amount) > Number(max.amount) ? exp : max, currentPeriodExpenses[0]);
        if (Number(maxExpense.amount) > currentTotal * 0.3 && Number(maxExpense.amount) > 0) { // If one expense is > 30% of total
            insights.push({
                id: 'large-expense',
                type: 'info',
                title: 'Large Expense Detected',
                description: `Your purchase of ${maxExpense.name} accounts for ${((Number(maxExpense.amount) / currentTotal) * 100).toFixed(0)}% of your spending.`
            });
        }
    }
    
    // Insight 4: Category concentration
    if (currentPeriodExpenses.length > 5) {
        const categoryTotals = currentPeriodExpenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
            return acc;
        }, {});
        
        const topCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b, "");
        const topCatAmount = categoryTotals[topCategory];
        
        if (topCatAmount > currentTotal * 0.4 && topCategory !== "Other" && topCategory !== "Bills") {
            insights.push({
                id: 'cat-concentration',
                type: 'info',
                title: `${topCategory} Heavy`,
                description: `A large chunk (${((topCatAmount / currentTotal) * 100).toFixed(0)}%) of your budget is going to ${topCategory}. Consider cutting back here if needed.`
            });
        }
    }

    return insights;
}
