export const isDateInPeriod = (dateString, period) => {
    if (!dateString) return false;
    if (period === "All") return true;

    const [year, part] = period.split("-");
    const expDate = new Date(dateString);
    const expYear = expDate.getFullYear().toString();

    // Yearly
    if (!part) {
        return year === expYear;
    }

    // Quarterly
    if (part.startsWith('Q')) {
        const quarter = parseInt(part.replace('Q', ''));
        const expQuarter = Math.ceil((expDate.getMonth() + 1) / 3);
        return year === expYear && quarter === expQuarter;
    }

    // Monthly
    return dateString.slice(0, 7) === period;
};

export const formatPeriodLabel = (period) => {
    if (period === "All") return "Full History";
    const [year, part] = period.split("-");

    if (!part) return year; // Yearly

    if (part.startsWith('Q')) {
        return `Q${part.replace('Q', '')} ${year}`; // Quarterly
    }

    // Monthly
    const date = new Date(`${period}-02`); 
    return `${date.toLocaleString('default', { month: 'short' })} ${year}`;
};

export const getDaysInPeriod = (period) => {
    const dateObj = new Date();
    if (period === "All") return 1; // avoid division by zero gracefully where used
    
    const [year, part] = period.split("-");

    if (!part) {
        // Yearly
        const currentYear = dateObj.getFullYear();
        if (parseInt(year) === currentYear) {
            const start = new Date(currentYear, 0, 0);
            const diff = dateObj - start;
            const oneDay = 1000 * 60 * 60 * 24;
            return Math.floor(diff / oneDay);
        }
        const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        return isLeap ? 366 : 365;
    }

    if (part.startsWith('Q')) {
        const quarter = parseInt(part.replace('Q', ''));
        const qStartMonth = (quarter - 1) * 3;
        const qStart = new Date(year, qStartMonth, 1);
        const qEnd = new Date(year, qStartMonth + 3, 0);
        
        const currentYear = dateObj.getFullYear();
        const currentMonth = dateObj.getMonth();
        const currentQuarter = Math.ceil((currentMonth + 1) / 3);

        if (parseInt(year) === currentYear && quarter === currentQuarter) {
             const diff = dateObj.getTime() - qStart.getTime();
             return Math.ceil(diff / (1000 * 3600 * 24));
        }

        const diff = qEnd.getTime() - qStart.getTime();
        return Math.ceil(diff / (1000 * 3600 * 24));
    }

    // Monthly
    const daysInMonth = new Date(parseInt(year), parseInt(part), 0).getDate();
    const isCurrentMonth = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}` === period;
    return isCurrentMonth ? dateObj.getDate() : daysInMonth;
};
