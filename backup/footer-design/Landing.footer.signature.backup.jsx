{/* SIGNATURE EXOVAULT FOOTER */}
<footer className="footer-v2">
  <div className="footer-aurora footer-aurora-a" aria-hidden="true"></div>
  <div className="footer-aurora footer-aurora-b" aria-hidden="true"></div>
  <div className="footer-v2-container">
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65 }}
      className="vault-core-shell"
    >
      <div className="vault-core-grid">
        <div className="vault-core-left">
          <span className="detail-tag">ExoVault Core</span>
          <h3>Where every expense becomes a strategic signal.</h3>
          <p>
            Built for people who want premium finance clarity. Log transactions in seconds, watch spending patterns evolve,
            and lock decisions with realtime budget intelligence.
          </p>
          <div className="vault-core-pills">
            <span><CheckCircle2 size={14} /> Instant categorization</span>
            <span><Activity size={14} /> Real-time movement tracking</span>
            <span><ShieldCheck size={14} /> Account-isolated data model</span>
          </div>
        </div>
        <div className="vault-core-right" aria-hidden="true">
          <div className="vault-ring outer"></div>
          <div className="vault-ring mid"></div>
          <div className="vault-ring inner"></div>
          <div className="vault-core-chip">VAULT ONLINE</div>
          <div className="vault-core-stats">
            <div>
              <span>Avg session focus</span>
              <strong>+42%</strong>
            </div>
            <div>
              <span>Budget response time</span>
              <strong>Realtime</strong>
            </div>
          </div>
        </div>
      </div>
    </motion.div>

    <div className="footer-stream-wrap" aria-hidden="true">
      <motion.div
        className="footer-stream"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        {[
          "Food budget crossing threshold",
          "Transport spend trending down",
          "Recurring expense synchronized",
          "Monthly report ready",
          "CSV export snapshot complete",
          "Savings momentum increasing"
        ].map((item, index) => (
          <div key={`${item}-${index}`} className="stream-pill">
            <Sparkles size={13} />
            {item}
          </div>
        ))}
        {[
          "Food budget crossing threshold",
          "Transport spend trending down",
          "Recurring expense synchronized",
          "Monthly report ready",
          "CSV export snapshot complete",
          "Savings momentum increasing"
        ].map((item, index) => (
          <div key={`${item}-clone-${index}`} className="stream-pill">
            <Sparkles size={13} />
            {item}
          </div>
        ))}
      </motion.div>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="footer-command-center"
    >
      <div className="footer-command-copy">
        <span className="detail-tag">Control Layer</span>
        <h3>Track. Analyze. Evolve.</h3>
        <p>
          One unified system for transaction flow, budget precision, and actionable reporting.
        </p>
      </div>
      <div className="footer-command-actions">
        <Link to="/signup" className="footer-command-btn primary">Launch Vault <ArrowRight size={16} /></Link>
        <Link to="/login" className="footer-command-btn">Live Dashboard <ChevronRight size={16} /></Link>
      </div>
    </motion.div>

    <div className="footer-v2-grid">
      <motion.div className="footer-v2-col brand-col">
        <div className="nav-brand" style={{ marginBottom: "1.5rem", transform: "none" }}>
          <div className="brand-dot"></div>
          EXOVAULT
        </div>
        <p className="footer-v2-desc">
          Precision-built personal finance cockpit with real-time sync, visual intelligence, and bank-grade account protection.
        </p>
      </motion.div>
    </div>
  </div>
</footer>
