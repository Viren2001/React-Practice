import React from "react";

// 1. Golden Coin Stack SVG
export const GoldCoinStackSVG = ({ size = 48, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="goldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Background Glow */}
    <circle cx="32" cy="32" r="26" fill="#f59e0b" opacity="0.15" filter="url(#glowGold)" />
    
    {/* Bottom Coin */}
    <ellipse cx="32" cy="46" rx="20" ry="8" fill="url(#goldGrad1)" />
    <path d="M12 46 v6 c0 4.4 9 8 20 8 s20 -3.6 20 -8 v-6" fill="url(#goldGrad1)" />
    <ellipse cx="32" cy="46" rx="17" ry="5.5" fill="none" stroke="#fef08a" strokeWidth="1" opacity="0.6" />

    {/* Middle Coin */}
    <path d="M12 36 v6 c0 4.4 9 8 20 8 s20 -3.6 20 -8 v-6" fill="url(#goldGrad1)" />
    <ellipse cx="32" cy="36" rx="20" ry="8" fill="url(#goldGrad2)" />
    <ellipse cx="32" cy="36" rx="17" ry="5.5" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.8" />

    {/* Top Coin */}
    <path d="M12 24 v6 c0 4.4 9 8 20 8 s20 -3.6 20 -8 v-6" fill="url(#goldGrad1)" />
    <ellipse cx="32" cy="24" rx="20" ry="8" fill="url(#goldGrad2)" filter="url(#glowGold)" />
    <ellipse cx="32" cy="24" rx="16" ry="5" fill="none" stroke="#ffffff" strokeWidth="1.5" />
    
    {/* Dollar Sign on Top Coin */}
    <text x="32" y="27" textAnchor="middle" fill="#78350f" fontSize="11" fontWeight="900" fontFamily="sans-serif">$</text>

    {/* Sparkles */}
    <path d="M48 12 L50 16 L54 18 L50 20 L48 24 L46 20 L42 18 L46 16 Z" fill="#fef08a" />
    <path d="M14 16 L15.5 19 L18.5 20.5 L15.5 22 L14 25 L12.5 22 L9.5 20.5 L12.5 19 Z" fill="#fde047" opacity="0.8" />
  </svg>
);

// 2. Futuristic Money Vault SVG
export const MoneyVaultSVG = ({ size = 48, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="vaultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d946ef" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <linearGradient id="doorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e1b4b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>
    {/* Vault Body */}
    <rect x="8" y="10" width="48" height="46" rx="12" fill="url(#doorGrad)" stroke="url(#vaultGrad)" strokeWidth="3" />
    
    {/* Corner Reinforcements */}
    <circle cx="16" cy="18" r="2.5" fill="#d946ef" />
    <circle cx="48" cy="18" r="2.5" fill="#d946ef" />
    <circle cx="16" cy="48" r="2.5" fill="#d946ef" />
    <circle cx="48" cy="48" r="2.5" fill="#d946ef" />

    {/* Vault Outer Ring */}
    <circle cx="32" cy="33" r="16" fill="#18181b" stroke="url(#vaultGrad)" strokeWidth="2.5" />
    
    {/* Dial Spokes */}
    <line x1="32" y1="20" x2="32" y2="46" stroke="#d946ef" strokeWidth="2" strokeLinecap="round" />
    <line x1="19" y1="33" x2="45" y2="33" stroke="#d946ef" strokeWidth="2" strokeLinecap="round" />
    <line x1="23" y1="24" x2="41" y2="42" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="41" y1="24" x2="23" y2="42" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />

    {/* Center Handle Knob */}
    <circle cx="32" cy="33" r="7" fill="#d946ef" />
    <circle cx="32" cy="33" r="3" fill="#ffffff" />
  </svg>
);

// 3. Money Growth & Bag SVG
export const MoneyGrowthSVG = ({ size = 48, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="bagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    {/* Money Bag */}
    <path
      d="M32 14 C26 14 23 18 20 22 C14 26 10 34 10 44 C10 54 18 58 32 58 C46 58 54 54 54 44 C54 34 50 26 44 22 C41 18 38 14 32 14 Z"
      fill="url(#bagGrad)"
    />
    {/* Tie */}
    <ellipse cx="32" cy="22" rx="10" ry="3" fill="#f59e0b" />
    <path d="M28 14 L24 8 L32 11 L40 8 L36 14 Z" fill="#34d399" />

    {/* Currency Symbol */}
    <circle cx="32" cy="40" r="9" fill="#065f46" opacity="0.5" />
    <text x="32" y="44" textAnchor="middle" fill="#ecfdf5" fontSize="14" fontWeight="900" fontFamily="sans-serif">₹</text>

    {/* Upward Trend Arrow */}
    <path
      d="M42 22 L54 10 M54 10 H44 M54 10 V20"
      stroke="#34d399"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 4. Financial Shield SVG
export const FinancialShieldSVG = ({ size = 48, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    <path
      d="M32 6 L52 14 V28 C52 42 42 53 32 58 C22 53 12 42 12 28 V14 L32 6 Z"
      fill="url(#shieldGrad)"
      stroke="#93c5fd"
      strokeWidth="2"
    />
    <path
      d="M32 12 L46 18 V28 C46 38 38 47 32 51 V12 Z"
      fill="#60a5fa"
      opacity="0.3"
    />
    {/* Check & Lock */}
    <path
      d="M24 30 L30 36 L42 22"
      stroke="#ffffff"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 5. Diamond Wealth SVG
export const DiamondWealthSVG = ({ size = 48, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="diamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#c084fc" />
      </linearGradient>
    </defs>
    <polygon points="32,8 52,22 32,56 12,22" fill="url(#diamGrad)" />
    <polygon points="32,8 40,22 32,56 24,22" fill="#ffffff" opacity="0.3" />
    <line x1="12" y1="22" x2="52" y2="22" stroke="#ffffff" strokeWidth="1.5" opacity="0.7" />
    <polyline points="20,8 24,22 32,8 40,22 44,8" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.7" />
  </svg>
);

// 6. Banknote / Cash Flow SVG
export const BanknoteSVG = ({ size = 48, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="6" y="16" width="52" height="32" rx="6" fill="#059669" stroke="#34d399" strokeWidth="2" />
    <circle cx="32" cy="32" r="8" fill="#10b981" stroke="#ecfdf5" strokeWidth="1.5" />
    <text x="32" y="36" textAnchor="middle" fill="#ecfdf5" fontSize="11" fontWeight="900" fontFamily="sans-serif">$</text>
    <circle cx="14" cy="32" r="3" fill="#a7f3d0" />
    <circle cx="50" cy="32" r="3" fill="#a7f3d0" />
  </svg>
);
