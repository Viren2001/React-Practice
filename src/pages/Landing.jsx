import React, { useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingDown,
  CheckCircle2,
  PieChart,
  Activity,
  Sparkles,
  Lock,
  Globe,
  Cloud,
  Database,
  Search,
  Download,
  Settings,
  Sun,
  Moon,
  BarChart
} from "lucide-react";
import {
  AnimatedVaultDoor,
  AnimatedGoldCoins,
  AnimatedGrowthChart,
  AnimatedShield,
  AnimatedCardCash,
  AnimatedDiamond
} from "../components/AnimatedFinanceSVGs";
import StatsCounter from "../components/StatsCounter";
import MarqueeStrip from "../components/MarqueeStrip";
import ParticleBackground from "../components/ParticleBackground";
import dashboardPreview from "../assets/dashboard-preview.png";
import "../styles/Landing.css";
import "../styles/Auth.css";

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const { currentUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const containerRef = useRef(null);
  const heroImageRef = useRef(null);
  const navRef = useRef(null);

  // Initialize Lenis Smooth Scroll + GSAP ScrollTrigger integration
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5
    });

    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // GSAP ScrollTrigger Animations
    const ctx = gsap.context(() => {
      // 1. Hero Stagger Entrance
      const heroTl = gsap.timeline();
      heroTl
        .from(".hero-tag-wrap", { opacity: 0, y: -20, scale: 0.8, duration: 0.8, ease: "back.out(1.7)" })
        .from(".hero-title-line", { opacity: 0, y: 50, duration: 0.9, stagger: 0.15, ease: "power4.out" }, "-=0.4")
        .from(".hero-desc-text", { opacity: 0, y: 20, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .from(".hero-action-row", { opacity: 0, y: 30, duration: 0.8, ease: "back.out(1.5)" }, "-=0.4")
        .from(".hero-visual-frame", { opacity: 0, y: 60, scale: 0.94, duration: 1.1, ease: "power3.out" }, "-=0.5");

      // 2. Feature Cards Scroll Trigger Entrance (With clearProps to prevent staying invisible)
      gsap.from(".creative-f-card", {
        y: 50,
        opacity: 0,
        scale: 0.94,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: "#features-grid",
          start: "top 90%",
          once: true
        }
      });

      // 6b. Infra Cards
      gsap.from(".infra-card", {
        y: 60,
        opacity: 0,
        scale: 0.92,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.5)",
        clearProps: "all",
        scrollTrigger: {
          trigger: ".infra-grid",
          start: "top 88%",
          once: true
        }
      });

      // 6c. Closing CTA entrance
      gsap.from(".closing-cta-card", {
        y: 80,
        opacity: 0,
        scale: 0.95,
        duration: 1.1,
        ease: "power4.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: ".closing-cta-section",
          start: "top 88%",
          once: true
        }
      });

      // 6d. Footer columns stagger
      gsap.from(".footer-v2-col", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: ".footer-v2-grid",
          start: "top 92%",
          once: true
        }
      });

      // 6e. Hero orb parallax
      gsap.to(".hero-orb-1", {
        y: -80,
        x: 40,
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1.5
        }
      });
      gsap.to(".hero-orb-2", {
        y: -120,
        x: -60,
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 2
        }
      });

      // 3. Ledger Mockup Rows Stagger
      gsap.from(".ledger-row-anim", {
        x: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: ".ledger-card-mockup",
          start: "top 90%",
          once: true
        }
      });

      // 4. Insights Chart Bars Growth
      gsap.from(".anim-c-bar", {
        scaleY: 0,
        transformOrigin: "bottom center",
        duration: 1,
        stagger: 0.12,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: ".chart-mockup",
          start: "top 90%",
          once: true
        }
      });

      // 5. Timeline Progress Line & Steps
      gsap.from(".p-step-anim", {
        x: -40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: ".p-steps",
          start: "top 90%",
          once: true
        }
      });

      // 6. Navigation shrinking on scroll
      gsap.to(".nav-pill", {
        scale: 0.95,
        backgroundColor: "rgba(10, 10, 10, 0.85)",
        backdropFilter: "blur(20px)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top -50px",
          end: "top -200px",
          scrub: 0.5
        }
      });

      // Force recalculation after layout renders
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
    }, containerRef);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  // 3D Perspective Tilt on MouseMove for Hero Preview Image
  const handleMouseMove = (e) => {
    if (!heroImageRef.current) return;
    const rect = heroImageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const rotateX = (-y / rect.height) * 16;
    const rotateY = (x / rect.width) * 16;

    gsap.to(heroImageRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 1000
    });
  };

  const handleMouseLeave = () => {
    if (!heroImageRef.current) return;
    gsap.to(heroImageRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: "power2.out"
    });
  };

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="landing-container" ref={containerRef}>
      {/* Particle Canvas Layer */}
      <ParticleBackground />

      {/* Floating Executive Navigation Header */}
      <div className="nav-wrap">
        <nav className="nav-pill" ref={navRef}>
          <a href="#top" onClick={scrollToTop} className="nav-brand">
            <div className="nav-brand-logo">
              <Zap size={18} fill="currentColor" />
            </div>
            <span>EXOVAULT</span>
          </a>

          <div className="nav-links-wrapper">
            <div className="nav-links">
              <a href="#features" className="nav-link">Features</a>
              <a href="#process" className="nav-link">Workflow</a>
              <a href="#security" className="nav-link">Security</a>
              <Link to="/login" className="nav-link sign-in-link">Sign In</Link>
            </div>
          </div>

          <div className="nav-controls">
            <div className="desktop-theme-toggle">
              <button
                onClick={toggleTheme}
                className="theme-toggle-btn"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
            <Link to="/signup" className="nav-cta">
              <span>Get Started</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      </div>

      {/* SECTION 1: HERO */}
      <section className="hero-section" id="top">
        {/* Decorative Floating Orbs */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-content">
          <div className="hero-tag-wrap">
            <div className="hero-tag">
              <Sparkles size={16} className="text-accent" />
              <span>Next-Gen Personal Finance Vault</span>
            </div>
          </div>

          <h1 className="hero-h1">
            <span className="hero-title-line">Master your wealth.</span> <br />
            <span className="hero-title-line font-serif text-gradient">Without spreadsheet chaos.</span>
          </h1>

          <p className="hero-desc-text hero-p">
            Cinematic financial tracking, real-time analytics, and automated net worth projections wrapped in an uncompromising aesthetic.
          </p>

          <div className="hero-action-row hero-btns">
            <div className="btn-row">
              <Link to="/signup" className="btn-lg btn-primary main-cta-btn">
                <span>Start Tracking Free</span>
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="hero-trust">
              <div className="avatar-group">
                <div className="avatar">OK</div>
                <div className="avatar">MW</div>
                <div className="avatar">JD</div>
              </div>
              <span>Built for people who want clarity—not spreadsheet chaos.</span>
            </div>
          </div>

          {/* 3D TILT DASHBOARD PREVIEW */}
          <div
            className="hero-visual-frame"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={heroImageRef}
          >
            <div className="glass-reflection-overlay"></div>
            <img
              src={dashboardPreview}
              alt="ExoVault Dashboard Preview"
              className="dashboard-image-preview"
            />
            {/* Animated Floating Badges on Dashboard */}
            <div className="floating-badge badge-left">
              <AnimatedGoldCoins size={36} />
              <div>
                <div className="badge-title">+₹45,200</div>
                <div className="badge-sub">Net Surplus This Month</div>
              </div>
            </div>
            <div className="floating-badge badge-right">
              <AnimatedShield size={36} />
              <div>
                <div className="badge-title">256-Bit Vault</div>
                <div className="badge-sub">Encrypted Sync</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <MarqueeStrip />

      {/* SECTION 2: STATS COUNTER */}
      <StatsCounter />

      {/* SECTION 3: CREATIVE ANIMATED FEATURES GRID */}
      <section className="section-padding" id="features">
        <div className="section-header center">
          <span className="detail-tag">Core Features</span>
          <h2 className="f-title">
            Intelligent Tools for <br />
            <span className="font-serif text-accent">Navigating Your Money.</span>
          </h2>
        </div>

        <div className="f-grid" id="features-grid">
          {/* Card 1: Money Health Score */}
          <div className="f-card creative-f-card">
            <span className="detail-tag">Intelligence</span>
            <div className="f-svg-wrap">
              <AnimatedGoldCoins size={72} />
            </div>
            <h3>Money Health Score</h3>
            <p>
              An intelligent 0–100 financial health gauge rating your savings velocity, cash flow discipline, and expense risk in real time.
            </p>
          </div>

          {/* Card 2: Wealth Simulator */}
          <div className="f-card creative-f-card">
            <span className="detail-tag">Simulation</span>
            <div className="f-svg-wrap">
              <AnimatedGrowthChart size={72} />
            </div>
            <h3>5-Year Wealth Simulator</h3>
            <p>
              Model custom financial futures. Adjust interest compounding, monthly surplus goals, and inflation rates dynamically.
            </p>
          </div>

          {/* Card 3: Bank-Level Security */}
          <div className="f-card creative-f-card" id="security">
            <span className="detail-tag">Vault Security</span>
            <div className="f-svg-wrap">
              <AnimatedVaultDoor size={72} />
            </div>
            <h3>Military Vault Protection</h3>
            <p>
              Backed by Google Firebase security infrastructure. Your financial data stays private, encrypted, and isolated to your account.
            </p>
          </div>

          {/* Card 4: Cards & Cashflow */}
          <div className="f-card creative-f-card">
            <span className="detail-tag">Card Control</span>
            <div className="f-svg-wrap">
              <AnimatedCardCash size={72} />
            </div>
            <h3>Multi-Source Logging</h3>
            <p>
              Categorize card payments, cash withdrawals, and investments in seconds with intuitive hotkeys and automated tags.
            </p>
          </div>

          {/* Card 5: Smart Shield */}
          <div className="f-card creative-f-card">
            <span className="detail-tag">Budget Guard</span>
            <div className="f-svg-wrap">
              <AnimatedShield size={72} />
            </div>
            <h3>Overspend Alerts</h3>
            <p>
              Instant visual warnings when any category approaches its budget ceiling before you overspend.
            </p>
          </div>

          {/* Card 6: Diamond Net Worth */}
          <div className="f-card creative-f-card">
            <span className="detail-tag">Net Worth</span>
            <div className="f-svg-wrap">
              <AnimatedDiamond size={72} />
            </div>
            <h3>Asset & Wealth Tracking</h3>
            <p>
              Consolidate your savings accounts, debts, and investments into a single unified net worth metric.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE CONTROL CENTER LEDGER */}
      <section className="section-padding s-ledger-preview">
        <div className="ledger-grid">
          <div className="ledger-info">
            <span className="detail-tag">Speed & Precision</span>
            <h2>
              Advanced <br />
              <span className="font-serif">Transaction Ledger.</span>
            </h2>
            <p className="hero-p" style={{ textAlign: "left", margin: "1.5rem 0" }}>
              Experience lightning-fast record keeping. Search, edit, and audit thousands of expense records with zero lag.
            </p>

            <div className="ledger-features">
              <div className="l-feat">
                <div className="l-feat-icon"><Search size={22} /></div>
                <div>
                  <h4>Instant Search & Filtering</h4>
                  <p>Filter by custom dates, category tags, or merchant names in under 10ms.</p>
                </div>
              </div>
              <div className="l-feat">
                <div className="l-feat-icon"><Download size={22} /></div>
                <div>
                  <h4>One-Click CSV Export</h4>
                  <p>Export clean, formatted CSV spreadsheets ready for accountants or tax filing.</p>
                </div>
              </div>
              <div className="l-feat">
                <div className="l-feat-icon"><Settings size={22} /></div>
                <div>
                  <h4>Batch Bulk Operations</h4>
                  <p>Select multiple entries to re-categorize or clean up history instantly.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="ledger-visual">
            <div className="ledger-card-mockup">
              <div className="mock-row header">
                <span>Merchant</span>
                <span>Category</span>
                <span>Amount</span>
              </div>
              <div className="mock-row ledger-row-anim">
                <div className="mock-vendor">
                  <div className="v-dot" style={{ background: "#d946ef" }}></div> Apple Store
                </div>
                <span className="mock-cat">Software</span>
                <span className="mock-amt">-$149.00</span>
              </div>
              <div className="mock-row active ledger-row-anim">
                <div className="mock-vendor">
                  <div className="v-dot" style={{ background: "#10b981" }}></div> Whole Foods
                </div>
                <span className="mock-cat">Groceries</span>
                <span className="mock-amt">-$64.20</span>
              </div>
              <div className="mock-row ledger-row-anim">
                <div className="mock-vendor">
                  <div className="v-dot" style={{ background: "#3b82f6" }}></div> Shell Gas Station
                </div>
                <span className="mock-cat">Transport</span>
                <span className="mock-amt">-$55.00</span>
              </div>
              <div className="mock-row active ledger-row-anim">
                <div className="mock-vendor">
                  <div className="v-dot" style={{ background: "#f59e0b" }}></div> Starbucks Coffee
                </div>
                <span className="mock-cat">Food & Drink</span>
                <span className="mock-amt">-$5.50</span>
              </div>
              <div className="mock-row ledger-row-anim">
                <div className="mock-vendor">
                  <div className="v-dot" style={{ background: "#8b5cf6" }}></div> Investment Dividends
                </div>
                <span className="mock-cat">Income</span>
                <span className="mock-amt income">+$420.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: SMART VISUAL INSIGHTS */}
      <section className="section-padding s-insights">
        <div className="insights-container">
          <div className="insights-visual">
            <div className="chart-mockup">
              <div className="chart-header">
                <BarChart size={22} className="text-accent" />
                <span>Monthly Cash Flow Velocity</span>
              </div>
              <div className="chart-bars">
                <div className="c-bar anim-c-bar" style={{ height: "45%" }}></div>
                <div className="c-bar anim-c-bar" style={{ height: "75%" }}></div>
                <div className="c-bar anim-c-bar highlight" style={{ height: "60%" }}></div>
                <div className="c-bar anim-c-bar" style={{ height: "95%" }}></div>
                <div className="c-bar anim-c-bar" style={{ height: "35%" }}></div>
                <div className="c-bar anim-c-bar highlight" style={{ height: "80%" }}></div>
              </div>
            </div>
          </div>

          <div className="insights-info">
            <span className="detail-tag">Deep Analytics</span>
            <h2>
              Visualizing <br />
              <span className="font-serif">the invisible patterns.</span>
            </h2>
            <p className="hero-p" style={{ textAlign: "left" }}>
              Dynamic charts that transform raw financial logs into clear visual stories. Spot leaks in your cash flow before they hurt.
            </p>
            <ul className="insights-list">
              <li><CheckCircle2 size={20} className="text-accent" /> Interactive Category Breakdown Charts</li>
              <li><CheckCircle2 size={20} className="text-accent" /> Daily & Weekly Spending Velocity</li>
              <li><CheckCircle2 size={20} className="text-accent" /> Automated Surplus & Deficit Insights</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 6: WORKFLOW PROCESS */}
      <section className="section-padding s-process" id="process">
        <div className="p-container">
          <div className="p-left">
            <span className="detail-tag">Simple Workflow</span>
            <h2>
              The friction <br />
              <span className="font-serif text-accent">is completely gone.</span>
            </h2>
            <p style={{ fontSize: "1.15rem", color: "var(--text-muted)", marginTop: "1rem" }}>
              Take back control of your finances in three frictionless steps.
            </p>
          </div>

          <div className="p-right">
            <div className="p-steps">
              <div className="p-line"></div>

              {/* Step 1 */}
              <div className="p-step p-step-anim">
                <div className="p-num">1</div>
                <div className="p-content">
                  <h3>Create Your Vault</h3>
                  <div className="p-step-body">
                    <p>Sign up securely in under 30 seconds. No banking password sharing, no credit card checks required.</p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-step p-step-anim">
                <div className="p-num">2</div>
                <div className="p-content">
                  <h3>Log Expenses Visually</h3>
                  <div className="p-step-body">
                    <p>Enter transactions naturally. ExoVault formats currencies, calculates balances, and tags categories automatically.</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-step p-step-anim">
                <div className="p-num">3</div>
                <div className="p-content">
                  <h3>Watch Your Wealth Grow</h3>
                  <div className="p-step-body">
                    <p>Watch your money health score climb, compound your surplus, and achieve financial clarity effortlessly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: STABLE CLOUD INFRASTRUCTURE */}
      <section className="section-padding s-infrastructure">
        <div className="section-header center">
          <span className="detail-tag">Infrastructure</span>
          <h2>Engineered for Absolute Stability</h2>
        </div>

        <div className="infra-grid">
          <div className="infra-card">
            <Cloud size={48} className="infra-icon" />
            <h3>Cloud Sync</h3>
            <p>Instant multi-device database sync powered by Google Firebase.</p>
          </div>
          <div className="infra-card">
            <Database size={48} className="infra-icon" />
            <h3>Scalable Engine</h3>
            <p>Built to handle decades of financial transactions without slowing down.</p>
          </div>
          <div className="infra-card">
            <Activity size={48} className="infra-icon" />
            <h3>99.9% Uptime</h3>
            <p>Reliable cloud access whenever and wherever you need your numbers.</p>
          </div>
        </div>
      </section>

      {/* CLOSING HERO CTA SECTION */}
      <section className="closing-cta-section">
        <div className="closing-cta-card">
          <AnimatedVaultDoor size={100} className="cta-vault-svg" />
          <h2 className="closing-cta-h2">
            Ready to experience <br />
            <span className="font-serif text-gradient">true financial clarity?</span>
          </h2>
          <p className="closing-cta-p">
            Join thousands of personal trackers building sustainable wealth with ExoVault. Free forever, no credit card needed.
          </p>
          <Link to="/signup" className="btn-lg btn-primary closing-cta-btn">
            <span>Create Your Free Vault</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-v2">
        <div className="footer-v2-container">
          <div className="footer-v2-grid">
            {/* Column 1 */}
            <div className="footer-v2-col brand-col">
              <div className="nav-brand" style={{ marginBottom: "1.5rem", transform: "none" }}>
                <div className="brand-dot"></div>
                EXOVAULT
              </div>
              <p className="footer-v2-desc">
                An intelligent financial companion designed for absolute wealth clarity. Fast, encrypted, and visually extraordinary.
              </p>
            </div>

            {/* Column 2 */}
            <div className="footer-v2-col">
              <h4 className="footer-v2-title">Platform</h4>
              <ul className="footer-v2-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#process">Workflow</a></li>
                <li><a href="#security">Security</a></li>
                <li><Link to="/login">Sign In</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="footer-v2-col">
              <h4 className="footer-v2-title">Product</h4>
              <ul className="footer-v2-links">
                <li><Link to="/signup">Create account</Link></li>
                <li><Link to="/login">Sign in</Link></li>
                <li><a href="#features">Features</a></li>
              </ul>
            </div>
          </div>

          {/* Details Bar */}
          <div className="footer-v2-details">
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className="status-indicator">
                <div className="status-dot"></div> All Systems Operational
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Built With</span>
              <span className="tech-stack">React 19 • GSAP + Lenis • Firebase</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Version</span>
              <span className="version-tag">Build 3.0.0-creative</span>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-v2-bottom">
            <div className="copyright">
              © 2026 ExoVault. Precision crafted for personal financial freedom.
            </div>
            <div className="bottom-links">
              <span className="bottom-link" style={{ opacity: 0.7, cursor: "default" }}>Privacy · Terms (coming soon)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
