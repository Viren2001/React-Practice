import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles, ShieldCheck, Cloud, PieChart,
  Rocket, TrendingUp, Gem, Star,
  DollarSign, IndianRupee, Coins, PiggyBank,
  Wallet, CreditCard, ArrowUpRight, Landmark
} from "lucide-react";

/* Animated counter hook */
function useCountUp(target, duration = 2000, delay = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
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

/* Different floating icons for signup - growth & aspiration themed */
const FLOATING_ICONS = [
  { Icon: Rocket, left: '6%', delay: '0s', dur: '16s', cls: 'style-a' },
  { Icon: Gem, left: '15%', delay: '3s', dur: '19s', cls: 'style-b' },
  { Icon: TrendingUp, left: '28%', delay: '1s', dur: '15s', cls: 'style-c' },
  { Icon: Star, left: '42%', delay: '5s', dur: '20s', cls: 'style-d' },
  { Icon: DollarSign, left: '55%', delay: '2s', dur: '17s', cls: 'style-a' },
  { Icon: IndianRupee, left: '70%', delay: '7s', dur: '14s', cls: 'style-b' },
  { Icon: Coins, left: '82%', delay: '4s', dur: '18s', cls: 'style-c' },
  { Icon: PiggyBank, left: '93%', delay: '6s', dur: '16s', cls: 'style-d' },
  { Icon: Wallet, left: '38%', delay: '9s', dur: '21s', cls: 'style-a' },
  { Icon: CreditCard, left: '12%', delay: '8s', dur: '15s', cls: 'style-b' },
  { Icon: Landmark, left: '65%', delay: '10s', dur: '17s', cls: 'style-c' },
  { Icon: Sparkles, left: '50%', delay: '11s', dur: '13s', cls: 'style-d' },
];

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== passwordConfirm) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await signup(email, password);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email address is already registered.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Failed to create an account. Please try again.");
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
            <Sparkles size={16} color="white" />
          </div>
          <span className="auth-brand-text">EXOVAULT</span>
        </Link>

        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join the smart money revolution</p>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="auth-group">
              <label>Confirm Password</label>
              <input
                type="password"
                required
                placeholder="Confirm your password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
            <button disabled={loading} className="auth-button" type="submit">
              {loading ? "Creating Account..." : "Start Your Journey"}
            </button>
          </form>
          <div className="auth-link">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </div>
      </div>

      {/* ===== RIGHT: Growth & Revolution Showcase ===== */}
      <div className="auth-right stagger-2">
        {/* Glowing orbs */}
        <div className="auth-right-orb orb-1"></div>
        <div className="auth-right-orb orb-2"></div>
        <div className="auth-right-orb orb-3"></div>

        {/* Floating icons */}
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
            Join The Smart<br />
            <span className="auth-title-accent">Money Revolution</span>
          </h1>
          <p className="auth-right-subtitle">
            Take control of your finances. Track, save, and grow your wealth with
            next-generation AI-powered expense management.
          </p>

          {/* Trend Chart */}
          <div className="auth-growth-chart">
            <div className="growth-chart-header">
              <span className="growth-chart-title">Cashflow Trend</span>
            </div>
            <svg className="growth-chart-svg" viewBox="0 0 400 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d946ef" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d946ef" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                className="growth-area"
                d="M0 85 C30 80, 60 75, 100 65 C140 55, 170 60, 200 45 C230 30, 260 35, 300 20 C340 10, 370 15, 400 5 L400 100 L0 100 Z"
                fill="url(#areaGradient)"
              />
              <path
                className="growth-line"
                d="M0 85 C30 80, 60 75, 100 65 C140 55, 170 60, 200 45 C230 30, 260 35, 300 20 C340 10, 370 15, 400 5"
              />
            </svg>
          </div>

          {/* Savings Ring */}
          <div className="auth-savings-ring-wrap">
            <svg className="savings-ring-svg" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d946ef" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <circle className="savings-ring-bg" cx="60" cy="60" r="54" />
              <circle className="savings-ring-fill" cx="60" cy="60" r="54" />
            </svg>
            <div className="savings-ring-info">
              <div className="savings-ring-percent">78%</div>
              <div className="savings-ring-label">Budget Limit</div>
              <div className="savings-ring-sublabel">
                <span className="dot"></span> Used this month
              </div>
            </div>
          </div>

          {/* Feature List */}
          <div className="auth-feature-list">
            <div className="auth-feat">
              <div className="feat-icon"><PieChart size={20} /></div>
              <div>
                <h4>Smart Analytics</h4>
                <p>Visual clarity of your spending journey</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
