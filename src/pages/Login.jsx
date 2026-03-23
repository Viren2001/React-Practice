import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

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
      setError("Failed to log in: " + err.message);
    }
    setLoading(false);
  }

  return (
    <div className="auth-container">
      {/* Animated Background Shapes */}
      <div className="auth-shape shape-1"></div>
      <div className="auth-shape shape-2"></div>
      <div className="auth-shape shape-3"></div>

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
  );
}
