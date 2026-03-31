import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

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
      <div className="auth-left stagger-1">
        <Link to="/" className="auth-nav">
          <div className="logo-icon-wrapper">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(-45deg)" }}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </div>
          Tracker<span>.</span>
        </Link>
        
        <div className="auth-shape shape-1"></div>
        <div className="auth-shape shape-2"></div>

        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join us to track your expenses</p>
          
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
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          <div className="auth-link">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </div>
      </div>

      <div className="auth-right stagger-2">
        <div className="auth-right-shape ar-shape-1"></div>
        <div className="auth-right-shape ar-shape-2"></div>
        
        <div className="auth-right-content">
          <h1 className="auth-right-title">Start Your Journey</h1>
          <p className="auth-right-subtitle">Take control of your finances. Join thousands tracking their expenses smart and easy.</p>
          
          <div className="auth-mockup">
            <div className="auth-mockup-header">
              <div className="auth-mockup-avatar"></div>
              <div style={{ flex: 1 }}>
                <div className="auth-mockup-line line-1"></div>
                <div className="auth-mockup-line line-2"></div>
              </div>
            </div>
            <div className="auth-mockup-stats">
              <div className="am-stat">
                <div className="am-stat-val">$2,500</div>
                <div className="am-stat-label">Budget</div>
              </div>
              <div className="am-stat">
                <div className="am-stat-val">$1,120</div>
                <div className="am-stat-label">Expenses</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
