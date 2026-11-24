import React from "react";
import "./AnimatedFinanceSVGs.css";

// 1. Futuristic Vault Door SVG with Animated Dial & Laser Scan
export const AnimatedVaultDoor = ({ size = 120, className = "" }) => (
  <div className={`animated-svg-wrapper ${className}`} style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="vault-svg">
      <defs>
        <linearGradient id="vaultBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="vaultRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d946ef" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="neonGlowVault" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Vault Body */}
      <rect x="10" y="10" width="80" height="80" rx="20" fill="url(#vaultBg)" stroke="url(#vaultRing)" strokeWidth="3" filter="url(#neonGlowVault)" />

      {/* Corner Rivets */}
      <circle cx="20" cy="20" r="3" fill="#d946ef" className="pulse-dot" />
      <circle cx="80" cy="20" r="3" fill="#06b6d4" className="pulse-dot delay-1" />
      <circle cx="20" cy="80" r="3" fill="#06b6d4" className="pulse-dot delay-2" />
      <circle cx="80" cy="80" r="3" fill="#d946ef" className="pulse-dot delay-3" />

      {/* Outer Dial Ring */}
      <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(217, 70, 239, 0.3)" strokeWidth="2" strokeDasharray="4 4" className="spin-slow" />
      <circle cx="50" cy="50" r="22" fill="#090d16" stroke="url(#vaultRing)" strokeWidth="2.5" />

      {/* Rotating Dial Handles */}
      <g className="spin-dial">
        <line x1="50" y1="32" x2="50" y2="68" stroke="#d946ef" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="50" x2="68" y2="50" stroke="#d946ef" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="37" y1="37" x2="63" y2="63" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
        <line x1="63" y1="37" x2="37" y2="63" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Center Lock Core */}
      <circle cx="50" cy="50" r="9" fill="#d946ef" filter="url(#neonGlowVault)" className="core-pulse" />
      <circle cx="50" cy="50" r="4" fill="#ffffff" />
      <path d="M50 43 L50 37" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" className="scanner-beam" />
    </svg>
  </div>
);

// 2. Animated Gold Coin Stack & Sparkle
export const AnimatedGoldCoins = ({ size = 120, className = "" }) => (
  <div className={`animated-svg-wrapper ${className}`} style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="coins-svg">
      <defs>
        <linearGradient id="goldTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="goldEdge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ambient Glow */}
      <circle cx="50" cy="55" r="35" fill="#f59e0b" opacity="0.15" filter="url(#goldGlow)" />

      {/* Bottom Coin */}
      <g className="coin-float-1">
        <path d="M20 68 v10 c0 6.6 13.4 12 30 12 s30 -5.4 30 -12 v-10" fill="url(#goldEdge)" />
        <ellipse cx="50" cy="68" rx="30" ry="12" fill="url(#goldTop)" stroke="#fef08a" strokeWidth="1" />
        <ellipse cx="50" cy="68" rx="24" ry="9" fill="none" stroke="#fde047" strokeWidth="1" opacity="0.6" />
      </g>

      {/* Middle Coin */}
      <g className="coin-float-2">
        <path d="M20 52 v10 c0 6.6 13.4 12 30 12 s30 -5.4 30 -12 v-10" fill="url(#goldEdge)" />
        <ellipse cx="50" cy="52" rx="30" ry="12" fill="url(#goldTop)" stroke="#fef08a" strokeWidth="1" />
        <ellipse cx="50" cy="52" rx="24" ry="9" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.8" />
      </g>

      {/* Top Coin */}
      <g className="coin-float-3">
        <path d="M20 36 v10 c0 6.6 13.4 12 30 12 s30 -5.4 30 -12 v-10" fill="url(#goldEdge)" />
        <ellipse cx="50" cy="36" rx="30" ry="12" fill="url(#goldTop)" filter="url(#goldGlow)" />
        <ellipse cx="50" cy="36" rx="24" ry="8" fill="none" stroke="#ffffff" strokeWidth="1.5" />
        <text x="50" y="41" textAnchor="middle" fill="#78350f" fontSize="16" fontWeight="900" fontFamily="sans-serif" className="currency-symbol">$</text>
      </g>

      {/* Floating Animated Sparkles */}
      <path d="M72 16 L74 22 L80 24 L74 26 L72 32 L70 26 L64 24 L70 22 Z" fill="#fef08a" className="sparkle-twinkle" />
      <path d="M24 22 L25.5 26 L29.5 27.5 L25.5 29 L24 33 L22.5 29 L18.5 27.5 L22.5 26 Z" fill="#fde047" className="sparkle-twinkle delay-1" />
      <circle cx="82" cy="45" r="2.5" fill="#fef08a" className="sparkle-float" />
      <circle cx="18" cy="48" r="2" fill="#f59e0b" className="sparkle-float delay-2" />
    </svg>
  </div>
);

// 3. Dynamic Growth & Yield Chart SVG
export const AnimatedGrowthChart = ({ size = 120, className = "" }) => (
  <div className={`animated-svg-wrapper ${className}`} style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="chart-svg">
      <defs>
        <linearGradient id="chartBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(16, 185, 129, 0.4)" />
          <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
        </linearGradient>
        <linearGradient id="chartLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="greenGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid Lines */}
      <line x1="15" y1="20" x2="85" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
      <line x1="15" y1="40" x2="85" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
      <line x1="15" y1="60" x2="85" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
      <line x1="15" y1="80" x2="85" y2="80" stroke="rgba(255,255,255,0.1)" />

      {/* Chart Area Fill */}
      <path d="M15 75 Q32 65, 45 48 T75 25 T88 15 V80 H15 Z" fill="url(#chartBgGrad)" className="area-fade" />

      {/* Animated Growing Path */}
      <path
        d="M15 75 Q32 65, 45 48 T75 25 T88 15"
        fill="none"
        stroke="url(#chartLineGrad)"
        strokeWidth="4.5"
        strokeLinecap="round"
        filter="url(#greenGlow)"
        className="draw-path"
      />

      {/* Animated Data Points */}
      <circle cx="15" cy="75" r="4" fill="#34d399" />
      <circle cx="45" cy="48" r="4.5" fill="#10b981" className="pulse-point" />
      <circle cx="75" cy="25" r="5" fill="#34d399" className="pulse-point delay-1" />
      <circle cx="88" cy="15" r="6" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" filter="url(#greenGlow)" className="pulse-point delay-2" />

      {/* Upward Arrow */}
      <g className="arrow-bounce">
        <path d="M72 12 L88 15 L82 28" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  </div>
);

// 4. Holographic Shield SVG
export const AnimatedShield = ({ size = 120, className = "" }) => (
  <div className={`animated-svg-wrapper ${className}`} style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="shield-svg">
      <defs>
        <linearGradient id="shieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <filter id="blueGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer Holographic Energy Ring */}
      <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1.5" strokeDasharray="6 6" className="spin-slow" />

      {/* Shield Main Shape */}
      <path
        d="M50 12 L80 24 V46 C80 66 65 82 50 88 C35 82 20 66 20 46 V24 L50 12 Z"
        fill="url(#shieldBg)"
        stroke="#93c5fd"
        strokeWidth="2.5"
        filter="url(#blueGlow)"
        className="shield-breathe"
      />

      {/* Inner Metallic Highlight */}
      <path d="M50 18 L74 28 V46 C74 62 61 76 50 81 V18 Z" fill="#60a5fa" opacity="0.25" />

      {/* Animated Scan Line */}
      <g className="scan-line-container">
        <line x1="25" y1="35" x2="75" y2="35" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" filter="url(#blueGlow)" className="scan-line" />
      </g>

      {/* Animated Checkmark */}
      <path
        d="M38 48 L46 56 L64 36"
        fill="none"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="check-draw"
      />
    </svg>
  </div>
);

// 5. Holographic Floating Credit Card & Cash SVG
export const AnimatedCardCash = ({ size = 120, className = "" }) => (
  <div className={`animated-svg-wrapper ${className}`} style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="card-cash-svg">
      <defs>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="cashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <filter id="cardGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Cash Bill Backing */}
      <g className="bill-float">
        <rect x="15" y="18" width="70" height="40" rx="8" fill="url(#cashGrad)" stroke="#34d399" strokeWidth="1.5" transform="rotate(-12 50 38)" opacity="0.85" />
        <circle cx="45" cy="36" r="8" fill="none" stroke="#a7f3d0" strokeWidth="1.5" transform="rotate(-12 50 38)" />
      </g>

      {/* Floating Credit Card Front */}
      <g className="card-float-3d">
        <rect x="15" y="35" width="70" height="44" rx="10" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" filter="url(#cardGlow)" />
        
        {/* Holographic Chip */}
        <rect x="25" y="45" width="12" height="10" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        <line x1="31" y1="45" x2="31" y2="55" stroke="#78350f" strokeWidth="0.8" />

        {/* Contactless Waves */}
        <path d="M42 47 C44 49 44 51 42 53" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none" className="wave-pulse" />
        <path d="M45 45 C48 48 48 52 45 55" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none" className="wave-pulse delay-1" />

        {/* Card Number Dots */}
        <rect x="25" y="62" width="28" height="3" rx="1.5" fill="#ffffff" opacity="0.8" />
        <rect x="58" y="60" width="18" height="6" rx="2" fill="rgba(255,255,255,0.3)" />
      </g>
    </svg>
  </div>
);

// 6. Sparkling Diamond Wealth SVG
export const AnimatedDiamond = ({ size = 120, className = "" }) => (
  <div className={`animated-svg-wrapper ${className}`} style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="diamond-svg">
      <defs>
        <linearGradient id="diamGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <filter id="diamGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Rotating Light Beams */}
      <g className="spin-slow">
        <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" />
        <line x1="22" y1="22" x2="78" y2="78" stroke="rgba(192, 132, 252, 0.2)" strokeWidth="1.5" />
        <line x1="78" y1="22" x2="22" y2="78" stroke="rgba(192, 132, 252, 0.2)" strokeWidth="1.5" />
      </g>

      {/* Main Diamond Facets */}
      <g className="diamond-float">
        <polygon points="50,15 80,35 50,85 20,35" fill="url(#diamGrad1)" stroke="#ffffff" strokeWidth="1.5" filter="url(#diamGlow)" />
        <polygon points="50,15 62,35 50,85 38,35" fill="#ffffff" opacity="0.35" />
        <line x1="20" y1="35" x2="80" y2="35" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
        <polyline points="32,15 38,35 50,15 62,35 68,15" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
      </g>

      {/* Sparkles around Diamond */}
      <path d="M78 20 L80 25 L85 27 L80 29 L78 34 L76 29 L71 27 L76 25 Z" fill="#38bdf8" className="sparkle-twinkle" />
      <path d="M22 68 L24 72 L28 73.5 L24 75 L22 79 L20.5 75 L16 73.5 L20.5 72 Z" fill="#c084fc" className="sparkle-twinkle delay-1" />
    </svg>
  </div>
);
