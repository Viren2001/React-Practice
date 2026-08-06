import React from "react";
import "./MarqueeStrip.css";

const marqueeItems = [
  "⚡ REAL-TIME SYNC",
  "🔒 FIREBASE BANK-LEVEL VAULT",
  "💎 5-YEAR WEALTH SIMULATOR",
  "📈 AUTOMATED INSIGHTS",
  "💰 ZERO SPREADSHEET FRICTION",
  "📊 SMART HEALTH SCORE",
  "🚀 FAST CSV EXPORTS"
];

export default function MarqueeStrip() {
  return (
    <div className="marquee-wrapper">
      <div className="marquee-track">
        {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
          <div key={idx} className="marquee-item">
            <span className="marquee-dot">•</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
