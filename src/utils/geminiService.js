// Allow UI to show even without API key for Demo purposes
export const isAIEnabled = true; 
export const isDemoMode = true;

/**
 * Analyzes spending and returns advice
 */
export const getFinancialAdvice = async (expenses, currency = "$") => {
  return "I'm currently running in demo mode. Connect Gemini API for real analysis!";
};

/**
 * Handle general chat queries about expenses
 */
export const chatWithAI = async (message, expenses, currency = "$") => {
  // Mock response for Demo Mode
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes("total")) {
    const total = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
    return `[DEMO MODE] Based on your ledger, your total lifetime spending is ${currency}${total.toFixed(2)}. (Connect Gemini API for real analysis!)`;
  }
  return "[DEMO MODE] I'm currently running in demo mode. I can still help you parse expenses if you use the 'Spent $X' format! To unlock my full intelligence, please add a VITE_GEMINI_API_KEY to your .env file.";
};

/**
 * Parse natural language into an expense object
 */
export const parseExpense = async (text) => {
  // Robust Mock Parser for Demo Mode
  const lowerText = text.toLowerCase();
  
  // 1. Extract Amount
  const amountMatch = text.match(/[\d,]+(\.\d+)?/);
  const amount = amountMatch ? parseFloat(amountMatch[0].replace(/,/g, '')) : 0;
  
  // 2. Extract Category based on common keywords
  let category = "Other";
  const keywords = {
    Food: ["food", "pizza", "burger", "drink", "coffee", "chai", "lunch", "dinner", "restaurant", "swiggy", "zomato", "biryani", "coke"],
    Transport: ["uber", "ola", "auto", "bus", "train", "metro", "petrol", "fuel", "gas", "ride", "taxi"],
    Shopping: ["amazon", "flipkart", "clothes", "shoes", "shirt", "mall", "shopping", "gift"],
    Entertainment: ["movie", "netflix", "game", "gaming", "hotstar", "club", "party"],
    Bills: ["recharge", "electricity", "bill", "rent", "wifi", "internet", "subscription"]
  };

  for (const [cat, words] of Object.entries(keywords)) {
    if (words.some(word => lowerText.includes(word))) {
      category = cat;
      break;
    }
  }

  // 3. Extract Name (Heuristic: what comes after 'on' or 'for')
  let name = "New Expense";
  if (lowerText.includes(" on ")) {
    name = text.split(/ on /i)[1];
  } else if (lowerText.includes(" for ")) {
    name = text.split(/ for /i)[1];
  } else {
    // Fallback: remove 'spent', numbers, and currencies
    name = text.replace(/spent|i|buy|bought|[\d,.]+|rupees|inr|rs|dollars|\$|euro/gi, "").trim();
  }
  
  // 4. Extract Date (Heuristic: yesterday or today)
  let date = new Date().toISOString().slice(0, 10);
  if (lowerText.includes("yesterday")) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    date = d.toISOString().slice(0, 10);
  }
  
  // Clean up name (additional cleaning for date words)
  name = name.replace(/yesterday|today/gi, "").trim();
  name = name.charAt(0).toUpperCase() + name.slice(1);

  return {
    name: name || "Miscellaneous",
    amount: amount,
    category: category,
    date: date
  };
};
