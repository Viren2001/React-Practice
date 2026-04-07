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
  BookOpen
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

export const getCategoryIcon = (category) => {
  return CategoryIcons[category] || CategoryIcons.Other;
};
