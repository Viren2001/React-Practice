import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Settings,
  Wallet,
  TrendingDown,
  Target,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  { label: "Total Spent", value: "$4,280", change: "+12%", icon: Wallet, accent: false },
  { label: "Budget Used", value: "68%", change: "On track", icon: Target, accent: true },
  { label: "Transactions", value: "142", change: "This month", icon: Receipt, accent: false },
];

const transactions = [
  { vendor: "Apple Store", cat: "Software", amt: "-$149", color: "#8b5cf6" },
  { vendor: "Whole Foods", cat: "Groceries", amt: "-$64", color: "#10b981" },
  { vendor: "Netflix", cat: "Entertainment", amt: "-$16", color: "#ef4444" },
];

const chartHeights = [35, 52, 41, 68, 55, 78, 48, 85, 62, 72, 58, 90];

export default function HeroDashboardMock() {
  return (
    <div className="hero-mock">
      <div className="hero-mock-chrome">
        <span className="chrome-dot red" />
        <span className="chrome-dot yellow" />
        <span className="chrome-dot green" />
        <span className="chrome-url">app.exovault.io/dashboard</span>
      </div>

      <div className="hero-mock-body">
        <aside className="hero-mock-sidebar">
          <div className="mock-logo">
            <div className="brand-dot" />
          </div>
          {[LayoutDashboard, Receipt, BarChart3, Settings].map((Icon, i) => (
            <div key={i} className={`mock-nav-item ${i === 0 ? "active" : ""}`}>
              <Icon size={16} />
            </div>
          ))}
        </aside>

        <main className="hero-mock-main">
          <div className="mock-header">
            <div>
              <span className="mock-greeting">Good morning, Alex</span>
              <h3 className="mock-title">March Overview</h3>
            </div>
            <div className="mock-badge">
              <TrendingDown size={14} />
              -8% vs last month
            </div>
          </div>

          <div className="mock-stats">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className={`mock-stat ${s.accent ? "accent" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
              >
                <div className="mock-stat-top">
                  <s.icon size={16} />
                  <ArrowUpRight size={12} className="mock-stat-arrow" />
                </div>
                <span className="mock-stat-value">{s.value}</span>
                <span className="mock-stat-label">{s.label}</span>
                <span className="mock-stat-change">{s.change}</span>
              </motion.div>
            ))}
          </div>

          <div className="mock-chart-row">
            <div className="mock-chart">
              <div className="mock-chart-label">
                <BarChart3 size={14} />
                Spending Trend
              </div>
              <div className="mock-chart-bars">
                {chartHeights.map((h, i) => (
                  <motion.div
                    key={i}
                    className={`mock-bar ${i === chartHeights.length - 1 ? "highlight" : ""}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.8 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}
              </div>
            </div>

            <div className="mock-recent">
              <span className="mock-recent-title">Recent</span>
              {transactions.map((t, i) => (
                <motion.div
                  key={t.vendor}
                  className="mock-tx"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                >
                  <div className="mock-tx-left">
                    <div className="mock-tx-dot" style={{ background: t.color }} />
                    <div>
                      <span className="mock-tx-vendor">{t.vendor}</span>
                      <span className="mock-tx-cat">{t.cat}</span>
                    </div>
                  </div>
                  <span className="mock-tx-amt">{t.amt}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <div className="hero-mock-glow" aria-hidden="true" />
    </div>
  );
}
