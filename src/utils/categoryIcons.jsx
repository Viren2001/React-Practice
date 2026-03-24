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
  Briefcase
} from 'lucide-react';

export const CategoryIcons = {
  Food: <Utensils size={18} />,
  Transport: <Car size={18} />,
  Shopping: <ShoppingBag size={18} />,
  Other: <MoreHorizontal size={18} />,
  All: <LayoutGrid size={18} />,
  // Adding some common extra categories just in case
  Entertainment: <Zap size={18} />,
  Housing: <Home size={18} />,
  Work: <Briefcase size={18} />,
  Bills: <CreditCard size={18} />,
};

export const getCategoryIcon = (category) => {
  return CategoryIcons[category] || CategoryIcons.Other;
};
