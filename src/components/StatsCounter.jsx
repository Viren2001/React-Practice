import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./StatsCounter.css";

gsap.registerPlugin(ScrollTrigger);

const statsData = [
  { value: 2.5, prefix: "₹", suffix: "Cr+", label: "Capital Tracked", sub: "Processed with precision" },
  { value: 50, prefix: "", suffix: "k+", label: "Active Trackers", sub: "Global wealth builders" },
  { value: 99.9, prefix: "", suffix: "%", label: "Cloud Uptime", sub: "Encrypted & reliable" },
  { value: 4.9, prefix: "", suffix: "★", label: "User Rating", sub: "From 12,000+ reviews" }
];

export default function StatsCounter() {
  const sectionRef = useRef(null);
  const countersRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      countersRef.current.forEach((el, index) => {
        if (!el) return;
        const targetObj = { val: 0 };
        const targetVal = statsData[index].value;

        gsap.to(targetObj, {
          val: targetVal,
          duration: 2.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true
          },
          onUpdate: () => {
            if (targetVal % 1 === 0) {
              el.innerText = Math.floor(targetObj.val).toLocaleString();
            } else {
              el.innerText = targetObj.val.toFixed(1);
            }
          }
        });
      });

      // Stagger card entrance
      gsap.from(".stat-card", {
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="stats-section" ref={sectionRef}>
      <div className="stats-grid">
        {statsData.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-value-wrap">
              <span className="stat-prefix">{stat.prefix}</span>
              <span className="stat-num" ref={(el) => (countersRef.current[idx] = el)}>
                0
              </span>
              <span className="stat-suffix">{stat.suffix}</span>
            </div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-sub">{stat.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
