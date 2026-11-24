import { motion } from "framer-motion";
import { DURATION, EASE } from "../utils/motionPresets";

function PageHeader({ title, subtitle, eyebrow = "ExoVault", actions }) {
  return (
    <motion.div
      className="page-header-container page-header-row"
      style={{ marginBottom: actions ? "24px" : "32px" }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.slow, ease: EASE.out }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {eyebrow && (
          <div className="page-eyebrow">
            <span className="page-eyebrow-dot" aria-hidden />
            {eyebrow}
          </div>
        )}
        <h1
          style={{
            fontSize: "clamp(26px, 4vw, 34px)",
            color: "var(--text-main)",
            marginBottom: "6px",
            fontWeight: "800",
            letterSpacing: "-0.04em",
            lineHeight: 1.15,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: "clamp(14px, 2.5vw, 16px)",
              color: "var(--text-muted)",
              fontWeight: "500",
              maxWidth: "52ch",
              lineHeight: 1.55,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="page-header-actions page-actions">{actions}</div>
      )}
    </motion.div>
  );
}

export default PageHeader;
