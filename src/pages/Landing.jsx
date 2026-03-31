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
  Globe
} from "lucide-react";
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
        position: 'sticky', 
        top: 0, 
        minHeight: '100vh', 
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
      {/* MAGNIFICENT DYNAMIC LIQUID MESH BACKGROUND */}
      <div className="mesh-bg"></div>

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
                 <Link to="/signup" className="btn-lg btn-primary" style={{display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
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

            {/* UPGRADED DASHBOARD MOCKUP */}
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="hero-visual-wrapper"
            >
              <div className="dash-window">
                <div className="dash-header">
                  <div className="dash-dots">
                     <div className="mac-btn" style={{ background: '#FF5F56' }}></div>
                     <div className="mac-btn" style={{ background: '#FFBD2E' }}></div>
                     <div className="mac-btn" style={{ background: '#27C93F' }}></div>
                  </div>
                  <span className="dash-url"><Lock size={12}/> tracker.app / overview <Globe size={12}/></span>
                  <div style={{width: '50px'}}></div>
                </div>
                
                <div className="dash-body">
                  <div className="d-left-panel">
                    <div className="d-card">
                      <div className="d-title">Total Monthly Spending</div>
                      <div className="d-amount">$4,250<span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>.00</span></div>
                      
                      <div className="d-list">
                        <div className="d-item" style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)' }}>
                           <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                             <div className="d-icon" style={{ background: 'var(--accent)' }}><CreditCard size={24} color="#FFF"/></div>
                             <div>
                               <div style={{ fontWeight: 700 }}>Stripe API</div>
                               <div style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>Software</div>
                             </div>
                           </div>
                           <div style={{ fontWeight: 800 }}>- $42.00</div>
                        </div>

                        <div className="d-item">
                           <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                             <div className="d-icon" style={{ background: 'var(--bg-app)' }}><Activity size={24} color="var(--text-muted)"/></div>
                             <div>
                               <div style={{ fontWeight: 700 }}>Whole Foods</div>
                               <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Groceries</div>
                             </div>
                           </div>
                           <div style={{ fontWeight: 800 }}>- $105.50</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-right-panel">
                    <div className="d-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                       <div>
                          <span className="detail-tag" style={{marginBottom: '0.5rem'}}>Warning</span>
                          <div className="d-title">Budget Health</div>
                       </div>
                       
                       <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: "75%" }} 
                          transition={{ duration: 1.5, delay: 1 }}
                          style={{ height: '10px', background: 'var(--accent)', borderRadius: '10px', boxShadow: '0 0 20px var(--accent-glow)' }}
                       />
                       <div style={{ marginTop: '1rem' }}>
                         <div style={{ fontSize: '2rem', fontWeight: 800 }}>75%</div>
                         <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Used of $5,600 Limit</div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </StackSection>

        {/* SECTION 2: FEATURES */}
        <StackSection>
          <div className="s-features" id="features">
            <h2 className="f-title">Designed for <br/><span className="font-serif text-accent">Uncompromised Quality.</span></h2>
            
            <div className="f-grid">
              <div className="f-card">
                 <span className="detail-tag">UX Design</span>
                 <div className="f-icon-container"><Zap size={32} /></div>
                 <h3>Lightning Entry</h3>
                 <p>Log a transaction perfectly in under 3 seconds. The interface adapts instantly without reloading the page.</p>
              </div>
              <div className="f-card">
                 <span className="detail-tag">Data Visual</span>
                 <div className="f-icon-container"><PieChart size={32} /></div>
                 <h3>Deep Analytics</h3>
                 <p>Your data transforms into gorgeous, interactive charts instantly. Discover exactly where your wealth is leaking seamlessly.</p>
              </div>
              <div className="f-card">
                 <span className="detail-tag">Encryption</span>
                 <div className="f-icon-container"><ShieldCheck size={32} /></div>
                 <h3>Bank-Level Security</h3>
                 <p>Powered by Google Firebase. Modern infrastructure ensuring your financial footprint stays locked securely to your device.</p>
              </div>
            </div>
          </div>
        </StackSection>

        {/* SECTION 3: PROCESS TIMELINE (ACCORDION HOVER) */}
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
      </div>

      {/* FOOTER IS EXCLUDED FROM STACK TO BEHAVE NATURALLY */}
      <div className="s-footer-wrapper">
         <footer className="s-footer">
            <div className="blob-bg"></div>
            
            <div className="footer-cta">
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }} 
                 whileInView={{ scale: 1, opacity: 1 }} 
                 viewport={{ once: true, margin: "0px 0px -20% 0px" }}
                 transition={{ duration: 0.6 }}
               >
                 <div className="huge-text">
                   <span>OWN</span>
                   <span style={{ WebkitTextStroke: '2px var(--glass-border)', WebkitTextFillColor: 'transparent' }}>YOUR</span>
                   <span>DATA.</span>
                 </div>
               </motion.div>
               <br />
               
               <Link to="/signup" className="footer-btn">
                 <div className="footer-btn-inner">
                   Start Your Engine <ArrowRight />
                 </div>
               </Link>
            </div>

            <div className="footer-bottom">
               <div>© 2026 Tracker App. Secured locally and encrypted naturally.</div>
               <div className="f-links">
                 <Link to="/login">Sign In</Link>
                 <a href="#">Privacy Policy</a>
                 <a href="#">Terms of Service</a>
               </div>
            </div>
         </footer>
      </div>

    </div>
  );
}
