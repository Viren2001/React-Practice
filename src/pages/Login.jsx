import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Activity, Zap, Target } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      <div className="auth-left stagger-1">
        <Link to="/" className="auth-nav">
          <div className="auth-diamond mini">
            <Zap size={16} color="white" />
          </div>
          <span className="auth-brand-text">LOGIN</span>
        </Link>



        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Log in to manage your expenses</p>

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

      <div className="auth-right stagger-2">


        <div className="auth-right-content">
          <h1 className="auth-right-title">Pick Up Where You Left Off</h1>
          <p className="auth-right-subtitle">Dive back into your financial insights and continue your journey to true financial freedom.</p>

          <div className="auth-features-mockup fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="auth-css-graphic">
              <div className="graphic-header">
                <div className="g-dot" style={{ background: '#ef4444' }}></div>
                <div className="g-dot" style={{ background: '#f59e0b' }}></div>
                <div className="g-dot" style={{ background: '#10b981' }}></div>
              </div>
              <div className="graphic-body">
                <div className="g-bar-group">
                  <div className="g-bar" style={{ height: '40%' }}></div>
                  <div className="g-bar" style={{ height: '70%' }}></div>
                  <div className="g-bar highlight" style={{ height: '100%' }}></div>
                  <div className="g-bar" style={{ height: '60%' }}></div>
                </div>
                <div className="g-stats">
                  <div className="g-stat-box">
                    <span className="g-lbl">Total Balance</span>
                    <span className="g-val">$12,450.00</span>
                  </div>
                  <div className="g-stat-box outline">
                    <span className="g-lbl">Monthly Spend</span>
                    <span className="g-val">$3,120.50</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="auth-feature-list">
              <div className="auth-feat">
                <div className="feat-icon"><Activity size={20} /></div>
                <div>
                  <h4>Deep Insights</h4>
                  <p>Review your monthly spending</p>
                </div>
              </div>
              <div className="auth-feat">
                <div className="feat-icon"><Zap size={20} /></div>
                <div>
                  <h4>Quick Logging</h4>
                  <p>Add expenses in seconds</p>
                </div>
              </div>
              <div className="auth-feat">
                <div className="feat-icon"><Target size={20} /></div>
                <div>
                  <h4>Budget Goals</h4>
                  <p>Always stay on track</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
