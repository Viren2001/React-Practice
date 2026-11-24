/** Shared motion tokens — keep timing consistent across the app */
export const EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.4, 0, 0.2, 1],
  spring: { type: "spring", stiffness: 380, damping: 32 },
};

export const DURATION = {
  fast: 0.2,
  normal: 0.35,
  slow: 0.55,
  page: 0.45,
};

export const pageTransition = {
  initial: { opacity: 0, y: 12, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.page, ease: EASE.out },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: DURATION.fast, ease: EASE.inOut },
  },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE.out },
  },
};

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: DURATION.slow, ease: EASE.out },
};
