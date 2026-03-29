import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  ArrowRight, 
  BarChart3, 
  ShieldCheck, 
  Zap,
  TrendingUp,
  CreditCard,
  PieChart
} from "lucide-react";
import "../styles/Landing.css";
import "../styles/Auth.css"; // Reuse animated background from auth

export default function Landing() {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="landing-container">
      {/* Animated Background Shapes */}
      <div className="auth-shape shape-1"></div>
      <div className="auth-shape shape-2"></div>
      <div className="auth-shape shape-3"></div>
      <div className="auth-shape shape-4"></div>

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <div className="logo-icon-wrapper">
             <ArrowRight size={20} color="white" style={{ transform: "rotate(-45deg)" }} />
          </div>
          Tracker<span>.</span>
        </div>
        <div className="landing-nav-links">
          <Link to="/login" className="nav-login">Log In</Link>
          <Link to="/signup" className="nav-signup">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section fade-in-up">
        <div className="hero-content stagger-1">
          <div className="hero-badge">
            <Zap size={14} className="badge-icon" />
            <span>The #1 Expense Tracking App</span>
          </div>
          <h1 className="hero-title">
            Master your money with <span>intelligent</span> tracking.
          </h1>
          <p className="hero-subtitle">
            Take full control of your finances. Track expenses, analyze spending habits, and build a wealthier future with our intuitive, real-time dashboard.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn-primary-large">
              Start Tracking Free
              <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn-secondary-large">
              See How It Works
            </Link>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">$2M+</span>
              <span className="stat-label">Expenses Tracked</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">4.9/5</span>
              <span className="stat-label">User Rating</span>
            </div>
          </div>
        </div>

        <div className="hero-visual stagger-2">
          <div className="glass-mockup main-mockup">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span></span><span></span><span></span>
              </div>
              <div className="mockup-title">Overview - Analytics</div>
            </div>
            <div className="mockup-body">
              <div className="mockup-row">
                <div className="mockup-card balance-card">
                  <div className="mc-title">Monthly Budget</div>
                  <div className="mc-amount">$2,500.00</div>
                  <div className="mc-trend positive"><TrendingUp size={14}/> 55% Remaining</div>
                </div>
                <div className="mockup-card">
                  <PieChart size={24} color="var(--primary)" />
                  <div className="mc-title mt-2">Expenses</div>
                  <div className="mc-amount sm">$3,240</div>
                </div>
              </div>
              <div className="mockup-list">
                <div className="ml-item">
                  <div className="ml-icon" style={{background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6'}}><CreditCard size={18}/></div>
                  <div className="ml-details">
                    <div className="ml-title">Groceries</div>
                    <div className="ml-sub">Today at 4:30 PM</div>
                  </div>
                  <div className="ml-amount">-$85.00</div>
                </div>
                <div className="ml-item">
                  <div className="ml-icon" style={{background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444'}}><ArrowRight size={18} style={{ transform: "rotate(-45deg)" }}/></div>
                  <div className="ml-details">
                    <div className="ml-title">Internet Bill</div>
                    <div className="ml-sub">Yesterday</div>
                  </div>
                  <div className="ml-amount">-$45.00</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating elements for dynamic feel */}
          <div className="floating-element f-1">
            <BarChart3 size={24} color="var(--primary)" />
            <span>Smart Insights</span>
          </div>
          <div className="floating-element f-2">
            <ShieldCheck size={24} color="var(--success)" />
            <span>Bank-grade Security</span>
          </div>
        </div>
      </div>

    </div>
  );
}
