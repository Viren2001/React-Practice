import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Zap, Activity, Target, TrendingUp,
  DollarSign, PiggyBank, Wallet, CreditCard,
  IndianRupee, Coins, ArrowUpRight, ArrowDownRight,
  Shield
} from "lucide-react";

/* Animated counter hook */
function useCountUp(target, duration = 2000, delay = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = performance.now();
      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return value;
}

/* Floating icons configuration */
const FLOATING_ICONS = [
  { Icon: DollarSign, left: '8%', delay: '0s', dur: '14s', cls: 'style-a' },
  { Icon: IndianRupee, left: '18%', delay: '2s', dur: '18s', cls: 'style-b' },
  { Icon: Coins, left: '30%', delay: '5s', dur: '16s', cls: 'style-c' },
  { Icon: PiggyBank, left: '45%', delay: '1s', dur: '20s', cls: 'style-d' },
  { Icon: Wallet, left: '60%', delay: '7s', dur: '15s', cls: 'style-a' },
  { Icon: CreditCard, left: '75%', delay: '3s', dur: '17s', cls: 'style-b' },
  { Icon: TrendingUp, left: '88%', delay: '4s', dur: '19s', cls: 'style-c' },
  { Icon: DollarSign, left: '52%', delay: '9s', dur: '13s', cls: 'style-d' },
  { Icon: IndianRupee, left: '35%', delay: '6s', dur: '21s', cls: 'style-a' },
  { Icon: Coins, left: '92%', delay: '8s', dur: '16s', cls: 'style-b' },
  { Icon: PiggyBank, left: '5%', delay: '11s', dur: '18s', cls: 'style-c' },
  { Icon: Wallet, left: '68%', delay: '10s', dur: '14s', cls: 'style-d' },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const balance = useCountUp(3120, 2200, 1000);
  const budget = useCountUp(4000, 2000, 1200);
  const txCount = useCountUp(47, 1500, 1400);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("An error occurred during log in. Please try again later.");
      }
    }
    setLoading(false);
  }

  return (
    <div className="auth-wrapper fade-in-up">
      {/* ===== LEFT: Form ===== */}
      <div className="auth-left stagger-1">
        <Link to="/" className="auth-nav">
          <div className="auth-diamond mini">
            <Zap size={16} color="white" />
          </div>
          <span className="auth-brand-text">EXOVAULT</span>
        </Link>

        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Log in to manage your money smarter</p>

          {error && (
            <div className="auth-error">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-group">
              <label>Email</label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="auth-group">
              <label>Password</label>
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button disabled={loading} className="auth-button" type="submit">
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
          <div className="auth-link">
            Need an account? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>

      {/* ===== RIGHT: Animated Finance Showcase ===== */}
      <div className="auth-right stagger-2">
        {/* Glowing orbs */}
        <div className="auth-right-orb orb-1"></div>
        <div className="auth-right-orb orb-2"></div>
        <div className="auth-right-orb orb-3"></div>

        {/* Floating money icons */}
        <div className="auth-floating-icons">
          {FLOATING_ICONS.map((item, i) => (
            <div
              key={i}
              className={`floating-icon ${item.cls}`}
              style={{
                left: item.left,
                bottom: '-40px',
                animationDelay: item.delay,
                animationDuration: item.dur,
              }}
            >
              <item.Icon size={24} />
            </div>
          ))}
        </div>

        <div className="auth-right-content">
          <h1 className="auth-right-title">
            Pick Up Where<br />
            <span className="auth-title-gradient">You Left Off</span>
          </h1>
          <p className="auth-right-subtitle">
            Dive back into your financial insights and continue your journey to
            true financial freedom.
          </p>

          {/* Animated Stats */}
          <div className="auth-stats-row">
            <div className="auth-stat-card">
              <div className="auth-stat-icon green">
                <TrendingUp size={20} />
              </div>
              <div className="auth-stat-value">${balance.toLocaleString()}</div>
              <div className="auth-stat-label">Total Spend</div>
            </div>
            <div className="auth-stat-card">
              <div className="auth-stat-icon purple">
                <Target size={20} />
              </div>
              <div className="auth-stat-value">${budget.toLocaleString()}</div>
              <div className="auth-stat-label">Monthly Budget</div>
            </div>
            <div className="auth-stat-card">
              <div className="auth-stat-icon gold">
                <Activity size={20} />
              </div>
              <div className="auth-stat-value">{txCount}</div>
              <div className="auth-stat-label">Transactions</div>
            </div>
          </div>

          {/* Animated Dashboard Mockup */}
          <div className="auth-dashboard-mockup">
            <div className="mockup-header">
              <div className="mockup-dots">
                <div className="m-dot" style={{ background: '#ef4444' }}></div>
                <div className="m-dot" style={{ background: '#f59e0b' }}></div>
                <div className="m-dot" style={{ background: '#10b981' }}></div>
              </div>
              <div className="mockup-title-bar">
                <Shield size={12} /> ExoVault Dashboard
              </div>
            </div>
            <div className="mockup-body">
              <div className="mockup-chart">
                <div className="m-bar dim" style={{ height: '35%' }}></div>
                <div className="m-bar mid" style={{ height: '55%' }}></div>
                <div className="m-bar glow" style={{ height: '90%' }}></div>
                <div className="m-bar mid" style={{ height: '70%' }}></div>
                <div className="m-bar dim" style={{ height: '45%' }}></div>
              </div>
              <div className="mockup-info">
                <div className="m-info-card">
                  <div className="m-info-label">Total Spend</div>
                  <div className="m-info-value accent">${balance.toLocaleString()}</div>
                  <div className="m-info-trend up">
                    <ArrowDownRight size={12} /> Good
                  </div>
                </div>
                <div className="m-info-card">
                  <div className="m-info-label">Budget</div>
                  <div className="m-info-value primary">78%</div>
                  <div className="m-info-trend down">
                    Used
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature List */}
          <div className="auth-feature-list">
            <div className="auth-feat">
              <div className="feat-icon"><Activity size={20} /></div>
              <div>
                <h4>Deep Insights</h4>
                <p>Detailed spending analysis</p>
              </div>
            </div>
            <div className="auth-feat">
              <div className="feat-icon"><Target size={20} /></div>
              <div>
                <h4>Smart Budgets</h4>
                <p>Auto-categorized, always on track</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
