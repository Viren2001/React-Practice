import React, { useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Zap,
  TrendingDown,
  Smartphone,
  CheckCircle2,
  PieChart,
  Activity,
  CreditCard,
  Layers,
  Sparkles,
  Lock,
  Globe,
  Terminal,
  MessageSquare,
  Mail,
  ExternalLink,
  ChevronRight,
  FileText,
  BarChart,
  Settings,
  Cloud,
  Database,
  Search,
  Download
} from "lucide-react";
import dashboardPreview from "../assets/dashboard-preview.png";
import "../styles/Landing.css";
import "../styles/Auth.css";

const StackSection = ({ children, customPadding }) => {
  const ref = useRef(null);

  // Track this section's static layout position as it natively scrolls past the top of the viewport
  // This executes perfectly over 100vh representing a clean, "normal" scroll experience.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Fades out and shrinks exactly as the *next* block slides up over it in DOM order
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <motion.section
      ref={ref}
      style={{
        top: 0,
        minHeight: '80vh',
        opacity,
        scale,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible',
        padding: customPadding || '0 5vw',
        transformOrigin: "center center"
      }}
    >
      <div style={{ width: '100%', maxWidth: '1300px' }}>
        {children}
      </div>
    </motion.section>
  );
};

export default function Landing() {
  const { currentUser } = useAuth();
  const navRef = useRef(null);
  const { scrollY } = useScroll();

  // Shrink the navigation pill slightly as we scroll down
  const navScale = useTransform(scrollY, [0, 100], [1, 0.95]);

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="landing-container">
      {/* Floating Magnetic Navigation */}
      <motion.div className="nav-wrap" style={{ scale: navScale }}>
        <nav className="nav-pill" ref={navRef}>
          <a href="#top" onClick={scrollToTop} className="nav-brand">
            <div className="brand-dot"></div>
            TRACKER
          </a>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#process" className="nav-link">Process</a>
            <Link to="/login" className="nav-link text-accent">Sign In</Link>
          </div>
          <Link to="/signup" className="nav-cta">Get Started</Link>
        </nav>
      </motion.div>

      {/* PAGE SCROLLING STACK FOR MAIN SECTIONS */}
      <div className="page-stacking-container">

        {/* SECTION 1: HERO & DASHBOARD */}
        <StackSection customPadding="120px 5vw 40px">
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="hero-tag"
            >
              <Sparkles size={16} /> Intelligent Finance Control
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="hero-h1"
            >
              Master your money. <br />
              <span className="font-serif">Without the spreadsheets.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-p"
            >
              Seamless data visualization, effortless logging, and an uncompromising modern aesthetic built for personal clarity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="hero-btns"
            >
              <div className="btn-row">
                <Link to="/signup" className="btn-lg btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  Start Tracking Free <ArrowRight size={20} />
                </Link>
              </div>
              <div className="hero-trust">
                <div className="avatar-group">
                  <div className="avatar">OK</div>
                  <div className="avatar">MW</div>
                  <div className="avatar">JD</div>
                </div>
                Joined by over 50,000+ personal trackers globally.
              </div>
            </motion.div>

            {/* UPGRADED DASHBOARD PREVIEW IMAGE */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="hero-visual-wrapper image-mode"
            >
              <img 
                src={dashboardPreview} 
                alt="Product Dashboard Preview" 
                className="dashboard-image-preview" 
              />
            </motion.div>
          </div>
        </StackSection>

        {/* SECTION 2: THE CONTROL CENTER */}
        <StackSection>
          <div className="s-ledger-preview">
            <div className="ledger-grid">
               <div className="ledger-info">
                  <span className="detail-tag">Interface</span>
                  <h2>Advanced <br/><span className="font-serif">Transaction Ledger.</span></h2>
                  <p className="hero-p" style={{textAlign: 'left', margin: '2rem 0'}}>
                    Manage your history with clinical precision. Our industry-grade ledger provides the power of a spreadsheet with the speed of a native app.
                  </p>
                  
                  <div className="ledger-features">
                     <div className="l-feat">
                        <div className="l-feat-icon"><Search size={20} /></div>
                        <div>
                           <h4>Instant Search</h4>
                           <p>Find any transaction by vendor or category in milliseconds.</p>
                        </div>
                     </div>
                     <div className="l-feat">
                        <div className="l-feat-icon"><Download size={20} /></div>
                        <div>
                           <h4>CSV Export</h4>
                           <p>Take your data anywhere. One-click export for professional tax reporting.</p>
                        </div>
                     </div>
                     <div className="l-feat">
                        <div className="l-feat-icon"><Settings size={20} /></div>
                        <div>
                           <h4>Batch Control</h4>
                           <p>Select multiple entries to bulk delete or categorize instantly.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="ledger-visual">
                  <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="ledger-card-mockup"
                  >
                     <div className="mock-row header">
                        <span>Vendor</span>
                        <span>Category</span>
                        <span>Amount</span>
                     </div>
                     <div className="mock-row">
                        <div className="mock-vendor"><div className="v-dot" style={{background: '#7c3aed'}}></div> Apple Store</div>
                        <span className="mock-cat">Software</span>
                        <span className="mock-amt">-$149.00</span>
                     </div>
                     <div className="mock-row active">
                        <div className="mock-vendor"><div className="v-dot" style={{background: '#10b981'}}></div> Whole Foods</div>
                        <span className="mock-cat">Groceries</span>
                        <span className="mock-amt">-$64.20</span>
                     </div>
                     <div className="mock-row">
                        <div className="mock-vendor"><div className="v-dot" style={{background: '#2563eb'}}></div> Shell Gas</div>
                        <span className="mock-cat">Transport</span>
                        <span className="mock-amt">-$55.00</span>
                     </div>
                     <div className="mock-row active">
                        <div className="mock-vendor"><div className="v-dot" style={{background: '#f59e0b'}}></div> Starbucks</div>
                        <span className="mock-cat">Food</span>
                        <span className="mock-amt">-$5.50</span>
                     </div>
                  </motion.div>
               </div>
            </div>
          </div>
        </StackSection>

        {/* SECTION 3: FEATURES GRID */}
        <StackSection>
          <div className="s-features" id="features">
            <h2 className="f-title">Designed for <br/><span className="font-serif text-accent">Personal Clarity.</span></h2>
            
            <div className="f-grid">
              <div className="f-card">
                 <span className="detail-tag">UX Design</span>
                 <div className="f-icon-container"><Zap size={32} /></div>
                 <h3>Lightning Entry</h3>
                 <p>Log a transaction perfectly in under 3 seconds. Press <kbd className="mock-kbd">N</kbd> to quick-add from anywhere.</p>
              </div>
              <div className="f-card">
                 <span className="detail-tag">Data Visual</span>
                 <div className="f-icon-container"><PieChart size={32} /></div>
                 <h3>Deep Analytics</h3>
                 <p>Your data transforms into gorgeous, interactive charts instantly. Discover exactly where your wealth is leaking.</p>
              </div>
              <div className="f-card">
                 <span className="detail-tag">Encryption</span>
                 <div className="f-icon-container"><ShieldCheck size={32} /></div>
                 <h3>Bank-Level Security</h3>
                 <p>Powered by Google Firebase. Modern infrastructure ensuring your financial footprint stays locked securely.</p>
              </div>
            </div>
          </div>
        </StackSection>

        {/* SECTION 4: SMART INSIGHTS PREVIEW */}
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
                         <motion.div initial={{ height: 0 }} whileInView={{ height: '40%' }} viewport={{ once: true }} className="c-bar"></motion.div>
                         <motion.div initial={{ height: 0 }} whileInView={{ height: '70%' }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="c-bar"></motion.div>
                         <motion.div initial={{ height: 0 }} whileInView={{ height: '55%' }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="c-bar highlight"></motion.div>
                         <motion.div initial={{ height: 0 }} whileInView={{ height: '90%' }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="c-bar"></motion.div>
                         <motion.div initial={{ height: 0 }} whileInView={{ height: '30%' }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="c-bar"></motion.div>
                      </div>
                   </div>
                </div>
                <div className="insights-info">
                   <span className="detail-tag">Intelligence</span>
                   <h2>Visualizing <br/><span className="font-serif">the invisible.</span></h2>
                   <p className="hero-p" style={{textAlign: 'left'}}>
                     Beautifully rendered charts that go beyond just numbers. Understand your spending patterns over time and across categories with zero effort.
                   </p>
                   <ul className="insights-list">
                      <li><CheckCircle2 size={18} color="var(--accent)" /> Interactive Category Breakdown</li>
                      <li><CheckCircle2 size={18} color="var(--accent)" /> Daily Spending Distribution</li>
                      <li><CheckCircle2 size={18} color="var(--accent)" /> Lifetime Spending Stats</li>
                   </ul>
                </div>
             </div>
          </div>
        </StackSection>

        {/* SECTION 5: PROCESS TIMELINE */}
        <StackSection>
          <div className="s-process" id="process">
            <div className="p-container">
              <div className="p-left">
                 <div>
                    <span className="detail-tag">Workflow</span>
                    <h2>The friction <br/><span className="font-serif">is gone.</span></h2>
                    <p style={{fontSize: '1.2rem', color: 'var(--text-muted)'}}>Experience seamless financial control in three steps. Hover to explore.</p>
                 </div>
              </div>
              <div className="p-right">
                <div className="p-steps">
                  <div className="p-line"></div>
                  
                  {/* Step 1 */}
                  <div className="p-step">
                     <div className="p-num">1</div>
                     <div className="p-content">
                       <h3>Create Securely</h3>
                       <div className="p-step-body">
                          <p>Sign up securely with just your email. No long forms, no credit card checks. Only instant access to the platform.</p>
                       </div>
                     </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-step">
                     <div className="p-num">2</div>
                     <div className="p-content">
                       <h3>Log Visually</h3>
                       <div className="p-step-body">
                          <p>Type the amount, select the category, and hit enter. Our aesthetic UI does the heavy formatting for you instantly.</p>
                       </div>
                     </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-step">
                     <div className="p-num">3</div>
                     <div className="p-content">
                       <h3>Adapt & Grow</h3>
                       <div className="p-step-body">
                          <p>Watch your spending habits form beautiful charts. Correct your behaviors and scale your budget smartly every single month.</p>
                       </div>
                     </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </StackSection>

        {/* SECTION 6: SCALABLE INFRASTRUCTURE */}
        <StackSection>
           <div className="s-infrastructure">
              <div className="infra-grid">
                 <div className="infra-card">
                    <Cloud size={48} className="infra-icon" />
                    <h3>Cloud Sync</h3>
                    <p>Real-time data synchronization across all your devices via Firebase.</p>
                 </div>
                 <div className="infra-card">
                    <Database size={48} className="infra-icon" />
                    <h3>Stable Core</h3>
                    <p>Highly scalable architecture built to handle years of financial history.</p>
                 </div>
                 <div className="infra-card">
                    <Activity size={48} className="infra-icon" />
                    <h3>Live Status</h3>
                    <p>99.9% uptime with constant infrastructure monitoring and heatchecks.</p>
                 </div>
              </div>
           </div>
        </StackSection>
      </div>

      {/* PROFESSIONAL MULTI-COLUMN ANIMATED FOOTER (v2) */}
      <footer className="footer-v2">
        <div className="footer-v2-container">
          {/* Main Footer Content */}
          <div className="footer-v2-grid">
            {/* Column 1: Brand & Desc */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="footer-v2-col brand-col"
            >
              <div className="nav-brand" style={{ marginBottom: '1.5rem', transform: 'none' }}>
                <div className="brand-dot"></div>
                TRACKER
              </div>
              <p className="footer-v2-desc">
                An intelligent financial companion designed to give you absolute clarity over your wealth. Built for speed, privacy, and visual excellence.
              </p>
              <div className="footer-v2-socials">
                <a href="#" className="social-pill"><MessageSquare size={18} /></a>
                <a href="#" className="social-pill"><Terminal size={18} /></a>
                <a href="#" className="social-pill"><Mail size={18} /></a>
              </div>
            </motion.div>

            {/* Column 2: Platform */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="footer-v2-col"
            >
              <h4 className="footer-v2-title">Platform</h4>
              <ul className="footer-v2-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#process">Workflow</a></li>
                <li><Link to="/login">Analytics</Link></li>
                <li><Link to="/signup">Security</Link></li>
              </ul>
            </motion.div>

            {/* Column 3: Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="footer-v2-col"
            >
              <h4 className="footer-v2-title">Resources</h4>
              <ul className="footer-v2-links">
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms</a></li>
              </ul>
            </motion.div>

            {/* Column 4: Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="footer-v2-col newsletter-col"
            >
              <h4 className="footer-v2-title">Stay Updated</h4>
              <p className="footer-v2-desc" style={{ fontSize: '0.9rem' }}>Join 5,000+ others receiving weekly financial clarity tips.</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Your email..." className="newsletter-input" />
                <button className="newsletter-btn"><ChevronRight size={20} /></button>
              </div>
            </motion.div>
          </div>

          {/* Detailed Project Info Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="footer-v2-details"
          >
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className="status-indicator"><div className="status-dot"></div> All Systems Operational</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Technology</span>
              <span className="tech-stack">React 18 • Firebase • Framer Motion</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Version</span>
              <span className="version-tag">Build 2.4.0-pro</span>
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <div className="footer-v2-bottom">
            <div className="copyright">
              © 2026 Tracker Dynamics. All rights reserved. Precision crafted for personal finance.
            </div>
            <div className="bottom-links">
              <a href="#" className="bottom-link">Sitemap</a>
              <a href="#" className="bottom-link">Cookies</a>
              <a href="#" className="bottom-link"><ExternalLink size={14} /> Open Source</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
