import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const AnimatedCounter = ({ value, prefix = "", suffix = "", fractionDigits = 0 }) => {
  const spring = useSpring(0, {
    mass: 1,
    stiffness: 75,
    damping: 15
  });
  
  const display = useTransform(spring, (current) => 
    prefix + current.toLocaleString(undefined, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }) + suffix
  );
  
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);
  
  return <motion.span>{display}</motion.span>;
};

export default AnimatedCounter;
