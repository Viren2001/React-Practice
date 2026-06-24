import React, { useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  PieChart,
  Activity,
  Sparkles,
  Terminal,
  MessageSquare,
  Mail,
  ChevronRight,
  BarChart,
  Settings,
  Cloud,
  Database,
  Search,
  Download,
  Sun,
  Moon,
  Bot,
  Globe,
  Repeat,
  Keyboard,
} from "lucide-react";
import HeroDashboardMock from "../components/HeroDashboardMock";
import "../styles/Landing.css";
import "../styles/Auth.css";

const StackSection = ({ children, customPadding }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <motion.section
      ref={ref}
      style={{
        top: 0,
        minHeight: "80vh",
        opacity,
        scale,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "visible",
        padding: customPadding || "0 5vw",
        transformOrigin: "center center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "1300px" }}>{children}</div>
    </motion.section>
  );
};

const STATS = [
  { value: "50K+", label: "Active Trackers" },
  { value: "$2M+", label: "Expenses Logged" },
  { value: "99.9%", label: "Uptime" },
  { value: "5", label: "Currencies" },
];

const MARQUEE_ITEMS = [
  "Multi-Currency",
  "AI Assistant",
  "Budget Alerts",
  "CSV Export",
  "Recurring Expenses",
  "Auto-Categorize",
  "Dark Mode",
  "Keyboard Shortcuts",
];

export default function Landing() {
  const { currentUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { scrollY } = useScroll();
  const navScale = useTransform(scrollY, [0, 100], [1, 0.95]);
  const navBgOpacity = useTransform(scrollY, [0, 80], [0.7, 0.92]);
  const navBackground = useTransform(navBgOpacity, (v) =>
    isDarkMode ? `rgba(10, 10, 10, ${v})` : `rgba(255, 255, 255, ${v})`
  );

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToFeatures = (e) => {
    e.preventDefault();
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-container">
      {/* Ambient hero background */}
      <div className="landing-bg" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />
      </div>

      {/* Navigation */}
      <motion.div className="nav-wrap" style={{ scale: navScale }}>
        <motion.nav className="nav-pill" style={{ background: navBackground }}>
          <a href="#top" onClick={scrollToTop} className="nav-brand">
            <div className="brand-dot" />
            <span>EXOVAULT</span>
          </a>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#process" className="nav-link">How It Works</a>
            <Link to="/login" className="nav-link text-accent">Sign In</Link>
          </div>
          <div className="desktop-theme-toggle">
            <button onClick={toggleTheme} className="theme-toggle-btn landing-theme-btn" aria-label="Toggle theme">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          <Link to="/signup" className="nav-cta">
            Get Started <ArrowRight size={16} />
          </Link>
        </motion.nav>
      </motion.div>

      <div className="mobile-theme-toggle landing-theme-toggle-wrap">
        <button onClick={toggleTheme} className="theme-toggle-btn landing-theme-btn" aria-label="Toggle theme">
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="page-stacking-container" id="top">
        {/* HERO */}
        <StackSection customPadding="130px 5vw 60px">
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="hero-tag"
            >
              <Sparkles size={15} />
              Premium Financial Intelligence
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="hero-h1"
            >
              Your money,{" "}
              <span className="hero-gradient">crystal clear.</span>
              <br />
              <span className="font-serif">No spreadsheets required.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-p"
            >
              ExoVault turns everyday spending into actionable insight — with stunning
              charts, smart budgets, AI guidance, and a design you'll actually enjoy using.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hero-btns"
            >
              <div className="btn-row">
                <Link to="/signup" className="btn-lg btn-primary">
                  Start Free Today <ArrowRight size={20} />
                </Link>
                <button onClick={scrollToFeatures} className="btn-lg btn-ghost">
                  Explore Features
                </button>
              </div>
              <div className="hero-trust">
                <div className="avatar-group">
                  {["AK", "SR", "JM", "LP"].map((initials) => (
                    <div key={initials} className="avatar">{initials}</div>
                  ))}
                </div>
                Trusted by 50,000+ personal finance enthusiasts worldwide
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="hero-visual-wrapper"
            >
              <HeroDashboardMock />
            </motion.div>
          </div>
        </StackSection>

        {/* STATS BAR */}
        <section className="stats-bar">
          <div className="stats-bar-inner">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* MARQUEE */}
        <section className="marquee-section" aria-hidden="true">
          <div className="marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="marquee-item">
                <CheckCircle2 size={14} />
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* LEDGER */}
        <StackSection>
          <div className="s-ledger-preview">
            <div className="ledger-grid">
              <div className="ledger-info">
                <span className="detail-tag">Transaction Engine</span>
                <h2>
                  Every expense,{" "}
                  <span className="font-serif">perfectly organized.</span>
                </h2>
                <p className="section-desc">
                  A ledger built for speed. Search, filter, bulk-edit, and export
                  your entire history in seconds — not hours.
                </p>
                <div className="ledger-features">
                  {[
                    { icon: Search, title: "Instant Search", desc: "Find any transaction by vendor, category, or amount." },
                    { icon: Download, title: "One-Click Export", desc: "Download CSV reports for taxes or accounting." },
                    { icon: Settings, title: "Bulk Actions", desc: "Select multiple entries to categorize or delete at once." },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="l-feat">
                      <div className="l-feat-icon"><Icon size={20} /></div>
                      <div>
                        <h4>{title}</h4>
                        <p>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="ledger-visual">
                <motion.div
                  initial={{ x: 40, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="ledger-card-mockup"
                >
                  <div className="mock-row header">
                    <span>Vendor</span>
                    <span>Category</span>
                    <span>Amount</span>
                  </div>
                  {[
                    { vendor: "Apple Store", cat: "Software", amt: "-$149.00", color: "#8b5cf6" },
                    { vendor: "Whole Foods", cat: "Groceries", amt: "-$64.20", color: "#10b981", active: true },
                    { vendor: "Shell Gas", cat: "Transport", amt: "-$55.00", color: "#2563eb" },
                    { vendor: "Starbucks", cat: "Food", amt: "-$5.50", color: "#f59e0b", active: true },
                  ].map((row) => (
                    <div key={row.vendor} className={`mock-row ${row.active ? "active" : ""}`}>
                      <div className="mock-vendor">
                        <div className="v-dot" style={{ background: row.color }} />
                        {row.vendor}
                      </div>
                      <span className="mock-cat">{row.cat}</span>
                      <span className="mock-amt">{row.amt}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </StackSection>

        {/* FEATURES */}
        <StackSection>
          <div className="s-features" id="features">
            <span className="detail-tag section-tag-center">Capabilities</span>
            <h2 className="f-title">
              Built for clarity.{" "}
              <span className="font-serif text-accent">Designed to delight.</span>
            </h2>
            <div className="f-grid">
              {[
                { tag: "Speed", icon: Zap, title: "Lightning Entry", desc: "Log expenses in under 3 seconds.", kbd: "N" },
                { tag: "Analytics", icon: PieChart, title: "Deep Insights", desc: "Interactive area and pie charts reveal exactly where your money goes." },
                { tag: "Security", icon: ShieldCheck, title: "Bank-Level Security", desc: "Firebase-powered auth and Firestore rules keep your data private." },
                { tag: "AI", icon: Bot, title: "AI Assistant", desc: "Ask questions about your spending and get instant, intelligent answers." },
                { tag: "Global", icon: Globe, title: "Multi-Currency", desc: "Track in $, €, £, ₹, or ¥ with instant symbol switching." },
                { tag: "Automation", icon: Repeat, title: "Recurring Expenses", desc: "Set up subscriptions and fixed costs to auto-track every month." },
              ].map(({ tag, icon: Icon, title, desc, kbd }) => (
                <div key={title} className="f-card">
                  <span className="detail-tag">{tag}</span>
                  <div className="f-icon-container"><Icon size={28} /></div>
                  <h3>{title}</h3>
                  <p>
                    {desc}
                    {kbd && <> Press <kbd className="mock-kbd">{kbd}</kbd> from anywhere to quick-add.</>}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </StackSection>

        {/* INSIGHTS */}
        <StackSection>
          <div className="s-insights">
            <div className="insights-container">
              <div className="insights-visual">
                <div className="chart-mockup">
                  <div className="chart-header">
                    <BarChart size={20} color="var(--accent)" />
                    <span>Monthly Spending Trend</span>
                  </div>
                  <div className="chart-bars">
                    {[40, 70, 55, 90, 30, 65, 80, 45].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className={`c-bar ${i === 3 ? "highlight" : ""}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="insights-info">
                <span className="detail-tag">Intelligence</span>
                <h2>
                  See what numbers{" "}
                  <span className="font-serif">can't say alone.</span>
                </h2>
                <p className="section-desc">
                  Beautiful charts that transform raw transactions into patterns you
                  can act on — by day, category, or lifetime.
                </p>
                <ul className="insights-list">
                  {[
                    "Interactive category breakdown",
                    "Daily spending distribution",
                    "Budget threshold alerts",
                    "Quarterly & yearly views",
                  ].map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={18} color="var(--accent)" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </StackSection>

        {/* PROCESS */}
        <StackSection>
          <div className="s-process" id="process">
            <div className="p-container">
              <div className="p-left">
                <span className="detail-tag">How It Works</span>
                <h2>
                  Three steps to{" "}
                  <span className="font-serif">financial clarity.</span>
                </h2>
                <p className="section-desc">
                  No complex setup. No learning curve. Just sign up and start tracking.
                </p>
                <div className="process-perks">
                  <div className="process-perk">
                    <Keyboard size={18} />
                    <span>Keyboard shortcuts built-in</span>
                  </div>
                  <div className="process-perk">
                    <Activity size={18} />
                    <span>Real-time sync across devices</span>
                  </div>
                </div>
              </div>
              <div className="p-right">
                <div className="p-steps">
                  <div className="p-line" />
                  {[
                    { num: 1, title: "Create Your Vault", body: "Sign up with email in seconds. No credit card, no friction — just instant access." },
                    { num: 2, title: "Log Effortlessly", body: "Enter amount, pick a category, done. Auto-categorization learns your habits over time." },
                    { num: 3, title: "Watch & Adapt", body: "Charts reveal your patterns. Adjust budgets, cut waste, and grow smarter every month." },
                  ].map((step) => (
                    <div key={step.num} className="p-step">
                      <div className="p-num">{step.num}</div>
                      <div className="p-content">
                        <h3>{step.title}</h3>
                        <div className="p-step-body">
                          <p>{step.body}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </StackSection>

        {/* INFRASTRUCTURE */}
        <StackSection>
          <div className="s-infrastructure">
            <div className="infra-grid">
              {[
                { icon: Cloud, title: "Cloud Sync", desc: "Real-time synchronization across all your devices via Firebase." },
                { icon: Database, title: "Scalable Core", desc: "Architecture built to handle years of financial history without slowdown." },
                { icon: Activity, title: "Live Status", desc: "99.9% uptime with continuous infrastructure monitoring." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="infra-card">
                  <Icon size={40} className="infra-icon" />
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </StackSection>

        {/* FINAL CTA */}
        <section className="final-cta">
          <motion.div
            className="final-cta-inner"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="final-cta-glow" aria-hidden="true" />
            <Sparkles size={24} className="final-cta-icon" />
            <h2>Ready to take control of your finances?</h2>
            <p>Join thousands who've replaced spreadsheets with something beautiful.</p>
            <div className="final-cta-btns">
              <Link to="/signup" className="btn-lg btn-primary">
                Create Free Account <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn-lg btn-ghost-light">
                Sign In
              </Link>
            </div>
          </motion.div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="footer-v2">
        <div className="footer-v2-container">
          <div className="footer-v2-grid">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="footer-v2-col brand-col"
            >
              <div className="nav-brand footer-brand">
                <div className="brand-dot" />
                EXOVAULT
              </div>
              <p className="footer-v2-desc">
                An intelligent financial companion designed for absolute clarity.
                Built for speed, privacy, and visual excellence.
              </p>
              <div className="footer-v2-socials">
                <a href="#" className="social-pill" aria-label="Discord"><MessageSquare size={18} /></a>
                <a href="#" className="social-pill" aria-label="GitHub"><Terminal size={18} /></a>
                <a href="#" className="social-pill" aria-label="Email"><Mail size={18} /></a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="footer-v2-col"
            >
              <h4 className="footer-v2-title">Platform</h4>
              <ul className="footer-v2-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#process">How It Works</a></li>
                <li><Link to="/signup">Get Started</Link></li>
                <li><Link to="/login">Sign In</Link></li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="footer-v2-col"
            >
              <h4 className="footer-v2-title">Resources</h4>
              <ul className="footer-v2-links">
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Help Center</a></li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="footer-v2-col newsletter-col"
            >
              <h4 className="footer-v2-title">Stay Updated</h4>
              <p className="footer-v2-desc small">Weekly tips on building better money habits.</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Your email..." className="newsletter-input" />
                <button className="newsletter-btn">
                  Subscribe <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="footer-v2-details"
          >
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className="status-indicator">
                <span className="status-dot" /> All Systems Operational
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Technology</span>
              <span className="tech-stack">React 19 · Firebase · Framer Motion</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Version</span>
              <span className="version-tag">v2.5.0</span>
            </div>
          </motion.div>

          <div className="footer-v2-bottom">
            <div className="copyright">
              © 2026 ExoVault. All rights reserved.
            </div>
            <div className="bottom-links">
              <a href="#" className="bottom-link">Privacy Policy</a>
              <a href="#" className="bottom-link">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
