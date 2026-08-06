import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import "../styles/PageLoader.css";

const PageLoader = ({ children }) => {
  const [shouldRender, setShouldRender] = useState(() => {
    // Only show loader if it has NOT been shown in this browser session
    return !sessionStorage.getItem("exovault_initial_loaded");
  });
  
  const [statusText, setStatusText] = useState("INITIALIZING VAULT CORE...");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(!shouldRender);

  const loaderRef = useRef(null);
  const cardRef = useRef(null);
  const ringRef = useRef(null);
  const fillRef = useRef(null);
  const counterRef = useRef(null);
  const statusRef = useRef(null);
  const orbRef = useRef(null);
  const pulseRef = useRef(null);

  useEffect(() => {
    if (!shouldRender) return;

    // Prevent scrolling while loader is running
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        // Mark session as loaded so page navigations skip loader
        sessionStorage.setItem("exovault_initial_loaded", "true");
        document.body.style.overflow = "";
        setIsCompleted(true);
        setShouldRender(false);
      }
    });

    // 1. Initial Reveal (0s - 0.4s)
    tl.fromTo(
      loaderRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    )
    .fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.85, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.4)" },
      "-=0.1"
    )
    .fromTo(
      ringRef.current,
      { rotation: -180, scale: 0.5 },
      { rotation: 0, scale: 1, duration: 0.6, ease: "power3.out" },
      "-=0.4"
    );

    // Continuous Orb Ambient Motion
    gsap.to(orbRef.current, {
      scale: 1.25,
      opacity: 0.8,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.easeInOut"
    });

    // Vault Ring Continuous Slow Spin during load
    gsap.to(ringRef.current, {
      rotation: 360,
      duration: 4,
      repeat: -1,
      ease: "none"
    });

    // 2. Counter & Progress Animation (0.4s - 2.5s) ~ 2.1s duration
    const progressObj = { value: 0 };

    tl.to(progressObj, {
      value: 100,
      duration: 2.1,
      ease: "power2.inOut",
      onUpdate: () => {
        const val = Math.floor(progressObj.value);
        if (counterRef.current) {
          counterRef.current.textContent = val;
        }
        if (fillRef.current) {
          fillRef.current.style.width = `${val}%`;
        }

        // Dynamic Status Updates
        if (val < 30) {
          setStatusText("AUTHENTICATING VAULT NODE...");
        } else if (val < 65) {
          setStatusText("ENCRYPTING FINANCIAL ASSETS...");
        } else if (val < 90) {
          setStatusText("SYNCING PORTFOLIO DATA...");
        } else {
          setStatusText("EXOVAULT SECURE & READY");
        }
      }
    });

    // 3. Finance Vault Unlock Burst & Cyber Fade Out Exit
    tl.to(pulseRef.current, {
      scale: 3.2,
      opacity: 1,
      duration: 0.25,
      ease: "power2.out",
      onStart: () => {
        setStatusText("FINANCIAL VAULT UNLOCKED");
        setIsUnlocked(true);
      }
    })
    .to(pulseRef.current, {
      opacity: 0,
      scale: 4.5,
      duration: 0.35,
      ease: "power2.out"
    }, "-=0.1")
    .to(cardRef.current, {
      scale: 1.08,
      opacity: 0,
      filter: "blur(12px)",
      duration: 0.45,
      ease: "power2.inOut"
    }, "-=0.35")
    .to(
      loaderRef.current,
      {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
      },
      "-=0.4"
    );

    return () => {
      document.body.style.overflow = "";
      tl.kill();
    };
  }, [shouldRender]);

  if (!shouldRender && isCompleted) {
    return <>{children}</>;
  }

  return (
    <>
      <div ref={loaderRef} className="page-loader-overlay">
        <div className="loader-scanlines"></div>
        <div ref={orbRef} className="loader-glow-orb"></div>

        <div ref={cardRef} className="loader-card">
          {/* Rotating Vault Graphic */}
          <div className="loader-vault-wrapper">
            <div ref={pulseRef} className="loader-unlock-pulse"></div>
            <svg
              ref={ringRef}
              className="loader-vault-ring"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="url(#loader_ring_grad)"
                strokeWidth="3"
                strokeDasharray="8 6"
              />
              <circle
                cx="60"
                cy="60"
                r="44"
                stroke="rgba(217, 70, 239, 0.3)"
                strokeWidth="1.5"
                strokeDasharray="40 20"
              />
              <defs>
                <linearGradient
                  id="loader_ring_grad"
                  x1="0"
                  y1="0"
                  x2="120"
                  y2="120"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#d946ef" />
                  <stop offset="0.5" stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            <div className="loader-vault-center">
              <ShieldCheck className="loader-vault-icon" />
            </div>
          </div>

          {/* Brand Info */}
          <div className="loader-brand">EXOVAULT</div>
          <div className="loader-tagline">NEXT-GEN FINANCIAL INTELLIGENCE</div>

          {/* Counter 0 to 100 */}
          <div className="loader-counter-box">
            <span ref={counterRef} className="loader-percentage">
              0
            </span>
            <span className="loader-percent-symbol">%</span>
          </div>

          {/* Glowing Progress Bar */}
          <div className="loader-bar-track">
            <div ref={fillRef} className="loader-bar-fill"></div>
          </div>

          {/* Status Message */}
          <div className={isUnlocked ? "loader-status-container unlocked" : "loader-status-container"}>
            <span className="loader-status-dot"></span>
            <span ref={statusRef} className="loader-status-text">
              {statusText}
            </span>
          </div>
        </div>
      </div>
      {children}
    </>
  );
};

export default PageLoader;
