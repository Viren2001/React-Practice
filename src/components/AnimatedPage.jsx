import { motion } from "framer-motion";
import { pageTransition } from "../utils/motionPresets";

export default function AnimatedPage({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      style={{ width: "100%", minHeight: "100%" }}
    >
      {children}
    </motion.div>
  );
}
