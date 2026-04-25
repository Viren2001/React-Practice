import React from 'react';
import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  MoreHorizontal, 
  LayoutGrid,
  CreditCard,
  Zap,
  Home,
  Briefcase,
  HeartPulse,
  BookOpen,
  Plane,
  Coffee,
  Dumbbell,
  Music,
  Gamepad2,
  Gift,
  Shirt,
  Smartphone,
  Wifi,
  PiggyBank,
  Bike,
  Baby,
  PawPrint,
  Camera,
  Scissors,
  Globe,
  TreePine,
  Star,
  ShoppingCart,
  Wine,
  Stethoscope,
  GraduationCap,
  Building2,
  Wrench,
  Fuel,
  Film,
} from 'lucide-react';

export const CategoryIcons = {
  Food: <Utensils size={18} />,
  Transport: <Car size={18} />,
  Shopping: <ShoppingBag size={18} />,
  Other: <MoreHorizontal size={18} />,
  All: <LayoutGrid size={18} />,
  Entertainment: <Zap size={18} />,
  Housing: <Home size={18} />,
  Work: <Briefcase size={18} />,
  Bills: <CreditCard size={18} />,
  Health: <HeartPulse size={18} />,
  Education: <BookOpen size={18} />,
};

// Keyword → icon mapping for custom category auto-detection
const keywordIconMap = [
  { keywords: ["food", "eat", "restaurant", "meal", "lunch", "dinner", "breakfast", "snack", "cafe", "kitchen"], icon: <Utensils size={18} /> },
  { keywords: ["coffee", "tea", "drink", "beverage", "juice", "chai"], icon: <Coffee size={18} /> },
  { keywords: ["car", "vehicle", "auto", "drive", "cab", "taxi", "uber", "bus", "train", "metro", "ride", "commute"], icon: <Car size={18} /> },
  { keywords: ["fuel", "petrol", "gas", "diesel"], icon: <Fuel size={18} /> },
  { keywords: ["flight", "travel", "trip", "holiday", "vacation", "tour", "airline", "airport"], icon: <Plane size={18} /> },
  { keywords: ["bike", "cycle", "cycling", "bicycle"], icon: <Bike size={18} /> },
  { keywords: ["shop", "store", "mart", "market", "buy", "purchase", "mall"], icon: <ShoppingCart size={18} /> },
  { keywords: ["clothes", "clothing", "fashion", "outfit", "apparel", "wear", "dress", "shirt", "jeans"], icon: <Shirt size={18} /> },
  { keywords: ["phone", "mobile", "smartphone", "device", "gadget", "tech"], icon: <Smartphone size={18} /> },
  { keywords: ["internet", "wifi", "subscription", "bill", "utility", "electric", "water", "electricity"], icon: <Wifi size={18} /> },
  { keywords: ["gym", "fitness", "workout", "exercise", "sport", "training", "yoga", "run"], icon: <Dumbbell size={18} /> },
  { keywords: ["doctor", "hospital", "medical", "medicine", "health", "clinic", "pharmacy", "dentist", "dental"], icon: <Stethoscope size={18} /> },
  { keywords: ["music", "concert", "spotify", "album", "song", "sound"], icon: <Music size={18} /> },
  { keywords: ["game", "gaming", "xbox", "playstation", "steam", "console"], icon: <Gamepad2 size={18} /> },
  { keywords: ["movie", "film", "cinema", "theater", "show", "series", "netflix", "streaming"], icon: <Film size={18} /> },
  { keywords: ["gift", "present", "birthday", "celebration", "anniversary", "party"], icon: <Gift size={18} /> },
  { keywords: ["school", "college", "university", "education", "course", "tuition", "study", "book", "learn"], icon: <GraduationCap size={18} /> },
  { keywords: ["home", "house", "rent", "apartment", "flat", "housing", "mortgage"], icon: <Home size={18} /> },
  { keywords: ["repair", "fix", "maintenance", "service", "plumber", "electrician", "handyman"], icon: <Wrench size={18} /> },
  { keywords: ["office", "work", "business", "corporate", "freelance", "project", "client"], icon: <Briefcase size={18} /> },
  { keywords: ["invest", "saving", "saving", "bank", "deposit", "fund", "mutual fund", "stock", "crypto"], icon: <PiggyBank size={18} /> },
  { keywords: ["baby", "child", "kid", "infant", "diaper", "toy"], icon: <Baby size={18} /> },
  { keywords: ["pet", "dog", "cat", "animal", "vet"], icon: <PawPrint size={18} /> },
  { keywords: ["photo", "camera", "photography", "studio"], icon: <Camera size={18} /> },
  { keywords: ["salon", "haircut", "spa", "beauty", "grooming"], icon: <Scissors size={18} /> },
  { keywords: ["nature", "park", "hiking", "outdoor", "camping", "garden"], icon: <TreePine size={18} /> },
  { keywords: ["wine", "beer", "alcohol", "bar", "pub", "liquor", "drinks"], icon: <Wine size={18} /> },
  { keywords: ["hotel", "hostel", "stay", "accommodation", "airbnb"], icon: <Building2 size={18} /> },
  { keywords: ["international", "foreign", "abroad", "overseas"], icon: <Globe size={18} /> },
];

/**
 * Returns an icon for a category.
 * - Known categories get their fixed icon.
 * - Custom categories get an auto-matched icon based on keyword scanning.
 * - Falls back to MoreHorizontal if no match found.
 */
export const getCategoryIcon = (category) => {
  if (!category) return CategoryIcons.Other;
  
  // Exact match first
  if (CategoryIcons[category]) return CategoryIcons[category];

  // Auto-detect icon by scanning the category name
  const lower = category.toLowerCase();
  for (const entry of keywordIconMap) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.icon;
    }
  }

  return CategoryIcons.Other;
};
