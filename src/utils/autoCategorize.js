const categoryKeywords = {
  Food: [
    "starbucks", "mcdonalds", "restaurant", "cafe", "coffee", "pizza", "burger", 
    "dinner", "lunch", "breakfast", "swiggy", "zomato", "groceries", "supermarket",
    "walmart", "whole foods", "subway", "kfc", "dunkin", "bakery", "taco bell",
    "dominos", "pizza hut"
  ],
  Transport: [
    "uber", "lyft", "taxi", "bus", "train", "metro", "fuel", "gas", "petrol", 
    "parking", "bridge toll", "flight", "airline", "delta", "indiao", "indigo", 
    "car wash", "repair", "shell", "mobil", "parking lot"
  ],
  Shopping: [
    "amazon", "flipkart", "ebay", "clothes", "zara", "h&m", "nike", "adidas", 
    "shoes", "gift", "mall", "target", "costco", "electronics", "apple store",
    "best buy", "macys", "walmart"
  ],
  Entertainment: [
    "netflix", "amazon prime", "spotify", "hulu", "disney", "movies", "cinema", 
    "theater", "concert", "gaming", "steam", "playstation", "xbox", "pub",
    "bar", "club", "twitch", "youtube"
  ],
  Bills: [
    "electricity", "water", "gas bill", "internet", "wifi", "phone bill", 
    "mobile", "recharge", "subscription", "insurance", "rent", "mortgage",
    "credit card", "loan", "at&t", "verizon", "t-mobile", "xfinity"
  ],
  Housing: [
    "rent", "mortgage", "appliances", "furniture", "ikea", "hardware", 
    "renovation", "cleaning", "home depot", "lowes"
  ],
  Work: [
    "office", "coworking", "software", "license", "equipment", "stationary", 
    "business", "slack", "zoom", "linkedin", "freelance"
  ],
  Health: [
    "doctor", "hospital", "pharmacy", "medicine", "gym", "fitness", "yoga", 
    "training", "dentist", "medical", "clinic"
  ],
  Education: [
    "school", "college", "university", "course", "udemy", "coursera", "book", 
    "tuition", "stationary", "library"
  ]
};

export const autoCategorize = (name) => {
  if (!name) return null;
  
  const lowerName = name.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerName.includes(keyword))) {
      return category;
    }
  }
  
  return null;
};
