import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
export const isAIEnabled = true; 
export const isDemoMode = !apiKey;

/**
 * Analyzes spending and returns advice
 */
export const getFinancialAdvice = async (expenses, currency = "$") => {
  if (isDemoMode) {
    return "I'm currently running in demo mode. Connect Gemini API for real analysis!";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a professional financial advisor. Analyze the following expense data and give 3 short, actionable tips to save money. Be encouraging and concise. Currency: ${currency}. Data: ${JSON.stringify(expenses)}`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (e) {
    console.error("Error in getFinancialAdvice:", e);
    return "Could not generate advice at this moment.";
  }
};

/**
 * Handle general chat queries about expenses
 */
export const chatWithAI = async (message, expenses, currency = "$") => {
  if (isDemoMode) {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes("total")) {
      const total = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
      return `[DEMO MODE] Based on your ledger, your total lifetime spending is ${currency}${total.toFixed(2)}. (Connect Gemini API for real analysis!)`;
    }
    return "[DEMO MODE] I'm currently running in demo mode. I can still help you parse expenses if you use the 'Spent $X' format! To unlock my full intelligence, please add a VITE_GEMINI_API_KEY to your .env file.";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const context = `You are Cyber-AI, an intelligent financial assistant for the ExoVault application.
Below is the user's transaction ledger in JSON format. Use this data to answer their questions accurately.
Currency Symbol: ${currency}
Ledger:
${JSON.stringify(expenses.map(e => ({ name: e.name, amount: e.amount, category: e.category, date: e.date })), null, 2)}

Keep your responses friendly, concise, and highly informative.`;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "Hello" }] },
        { role: "model", parts: [{ text: "Hello! I am your Cyber-AI advisor. How can I help you analyze your finances today?" }] }
      ]
    });

    const result = await chat.sendMessage([context, message]);
    return result.response.text().trim();
  } catch (error) {
    console.error("Error in Gemini Chat:", error);
    return "Oops! I encountered an error communicating with my neural network. Please verify your Gemini API key.";
  }
};

/**
 * Parse natural language into an expense object
 */
export const parseExpense = async (text) => {
  if (isDemoMode) {
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
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Parse the following natural language sentence into a structured JSON expense object: "${text}".
Format:
{
  "name": "A clean, concise name for the transaction (e.g. Coffee instead of 'coffee at starbucks')",
  "amount": 25.50 (number representing the expense amount, parse as float),
  "category": "One of the standard categories: Food, Transport, Shopping, Bills, Entertainment, Health, Education, Housing, Work, or Other",
  "date": "YYYY-MM-DD (format). If a day like 'yesterday' or 'last Friday' is mentioned, calculate the exact date. Otherwise, default to today: ${new Date().toISOString().slice(0, 10)}"
}
Return only raw JSON. Do not write any markdown formatting like \`\`\`json or explanations.`;

    const result = await model.generateContent(prompt);
    const textRes = result.response.text().trim();
    const cleanJSON = textRes.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    return JSON.parse(cleanJSON);
  } catch (error) {
    console.error("Error parsing text expense:", error);
    return null;
  }
};

/**
 * Parse a receipt image using Gemini Vision model
 */
export const parseReceiptImage = async (base64Data, mimeType, categories = []) => {
  if (isDemoMode) {
    // Simulate a parsed receipt response in demo mode
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      name: "Supermart Store",
      amount: 42.85,
      category: categories.includes("Shopping") ? "Shopping" : categories[0] || "Other",
      date: new Date().toISOString().slice(0, 10)
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };

    const categoriesList = categories.join(", ");
    const prompt = `Analyze this receipt image and extract the following details in raw JSON format (do not include any markdown styling like \`\`\`json or \`\`\`, just the raw JSON text):
{
  "name": "The name of the store, merchant, or key item purchased (capitalize properly, e.g. Starbucks)",
  "amount": 12.34 (number representing the total amount on the receipt, parsed as float),
  "category": "The best matching category from this list: [${categoriesList}]. If none match well, output 'Other'.",
  "date": "YYYY-MM-DD (the transaction date parsed from receipt. If not found, use current date)"
}

Ensure the output is valid JSON and contains only the specified fields.`;

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text().trim();
    const cleanJSON = responseText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    return JSON.parse(cleanJSON);
  } catch (error) {
    console.error("Error parsing receipt image:", error);
    throw error;
  }
};
