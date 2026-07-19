// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   Sparkles, Wallet, PieChart, Landmark, Settings, ArrowRight, ArrowLeft, Check, 
//   Rocket, Coins, ShieldAlert, Award, Star, Activity, ListOrdered, Keyboard, Bot
// } from "lucide-react";
// import { getCategoryIcon } from "../utils/categoryIcons";
// import "../styles/OnboardingWizard.css";

// const steps = [
//   { id: 1, title: "Welcome to ExoVault", subtitle: "Your smart personal finance command center." },
//   { id: 2, title: "Configure Vault", subtitle: "Set up your default preferences and budget." },
//   { id: 3, title: "Explore ExoVault Pages", subtitle: "Take a quick tour of our core workspaces." },
//   { id: 4, title: "Ready for Lift-off!", subtitle: "Your financial vault is ready to go." }
// ];

// const tourPages = [
//   {
//     id: "dashboard",
//     name: "Dashboard",
//     icon: <Sparkles size={16} />,
//     desc: "Your primary command center. View real-time cashflow trends, budget pacing meters, top spending categories, and receive AI-generated smart insights regarding your spending habits.",
//     previewText: "📊 Real-time charts + 🧠 AI Insights Engine"
//   },
//   {
//     id: "expenses",
//     name: "Ledger (Transactions)",
//     icon: <Wallet size={16} />,
//     desc: "The central ledger where you add, edit, and search expenses. Features advanced filtering, exporting data to CSV, bulk item deletions, and automated recurring expense scheduling.",
//     previewText: "📝 Central Ledger & Quick Add Shortcuts"
//   },
//   {
//     id: "reports",
//     name: "Analysis Studio",
//     icon: <PieChart size={16} />,
//     desc: "Dive deep into your financial distribution. Interactive charts like the Radar spend map and Category comparison bars help you identify where every rupee goes.",
//     previewText: "📈 Category Breakdowns & Radar Charting"
//   },
//   {
//     id: "settings",
//     name: "Preferences (Settings)",
//     icon: <Settings size={16} />,
//     desc: "Fine-tune your ExoVault experience. Create custom categories, specify category-level budget restrictions, customize currency symbol, and configure budget notification thresholds.",
//     previewText: "⚙️ Custom Categories & Threshold Alerts"
//   }
// ];

// export default function OnboardingWizard({ onComplete }) {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [currency, setCurrency] = useState("₹");
//   const [budget, setBudget] = useState("30000");
  
//   const defaultCategories = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Education", "Housing", "Work", "Other"];
//   const [selectedCategories, setSelectedCategories] = useState(defaultCategories);
//   const [tourTab, setTourTab] = useState("dashboard");

//   const toggleCategory = (cat) => {
//     setSelectedCategories(prev => 
//       prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
//     );
//   };

//   const handleNext = () => {
//     if (currentStep < 4) {
//       setCurrentStep(prev => prev + 1);
//     } else {
//       onComplete({
//         currency,
//         budget: Number(budget),
//         categories: selectedCategories
//       });
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep(prev => prev - 1);
//     }
//   };

//   return (
//     <div className="onboarding-overlay">
//       <motion.div 
//         className="onboarding-card"
//         initial={{ opacity: 0, scale: 0.9, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
//       >
//         {/* Header */}
//         <div className="onboarding-header">
//           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             <div style={{ background: "var(--primary)", color: "white", padding: "8px", borderRadius: "10px", boxShadow: "0 0 15px var(--primary-glow)", display: "flex" }}>
//               <Sparkles size={18} />
//             </div>
//             <span style={{ fontSize: "14px", fontWeight: "900", letterSpacing: "1.5px", color: "var(--primary)", textTransform: "uppercase" }}>EXOVAULT</span>
//           </div>

//           <div className="onboarding-progress-container">
//             {steps.map(s => (
//               <div 
//                 key={s.id} 
//                 className={`onboarding-progress-bar ${s.id <= currentStep ? "active" : ""}`}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Content Body */}
//         <div className="onboarding-body">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentStep}
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               transition={{ duration: 0.3 }}
//               style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}
//             >
//               <h3 className="onboarding-title">{steps[currentStep - 1].title}</h3>
//               <p className="onboarding-subtitle">{steps[currentStep - 1].subtitle}</p>

//               {/* Step 1: Welcome */}
//               {currentStep === 1 && (
//                 <div className="feature-intro-grid">
//                   <div className="feature-intro-card">
//                     <Bot size={20} />
//                     <div>
//                       <h4>AI Insights Engine</h4>
//                       <p>Receive live, intelligent feedback regarding cashflow, category budgets, and savings alerts.</p>
//                     </div>
//                   </div>
//                   <div className="feature-intro-card">
//                     <Wallet size={20} />
//                     <div>
//                       <h4>Smart Transaction Tracking</h4>
//                       <p>Add and filter expenses, customize categories, and handle recurring payments easily.</p>
//                     </div>
//                   </div>
//                   <div className="feature-intro-card">
//                     <PieChart size={20} />
//                     <div>
//                       <h4>Interactive Visualization</h4>
//                       <p>Analyze trends using beautiful responsive pie, line, and radar chart workspaces.</p>
//                     </div>
//                   </div>
//                   <div className="feature-intro-card">
//                     <Keyboard size={20} />
//                     <div>
//                       <h4>Power-User UX</h4>
//                       <p>Speed up logging with global keyboard hotkeys and spotlight command palette tools.</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Step 2: Setup Preferences */}
//               {currentStep === 2 && (
//                 <div className="onboarding-form" style={{ marginTop: "24px" }}>
//                   <div className="form-row">
//                     <div className="onboarding-input-group">
//                       <label>Currency</label>
//                       <select 
//                         className="onboarding-select" 
//                         value={currency} 
//                         onChange={(e) => setCurrency(e.target.value)}
//                       >
//                         <option value="₹">₹ INR</option>
//                         <option value="$">$ USD</option>
//                         <option value="€">€ EUR</option>
//                         <option value="£">£ GBP</option>
//                         <option value="¥">¥ JPY</option>
//                       </select>
//                     </div>
//                     <div className="onboarding-input-group">
//                       <label>Monthly Spending Target</label>
//                       <input 
//                         type="number" 
//                         className="onboarding-input" 
//                         value={budget} 
//                         onChange={(e) => setBudget(e.target.value)} 
//                         placeholder="30000"
//                       />
//                     </div>
//                   </div>

//                   <div className="onboarding-input-group">
//                     <label>Active Categories ({selectedCategories.length} selected)</label>
//                     <div className="category-toggle-grid">
//                       {defaultCategories.map(cat => (
//                         <div 
//                           key={cat} 
//                           className={`category-toggle-pill ${selectedCategories.includes(cat) ? "active" : ""}`}
//                           onClick={() => toggleCategory(cat)}
//                         >
//                           {getCategoryIcon(cat)}
//                           <span>{cat}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Step 3: Tour pages */}
//               {currentStep === 3 && (
//                 <div className="tour-layout">
//                   <div className="tour-nav-list">
//                     {tourPages.map(page => (
//                       <button 
//                         key={page.id}
//                         onClick={() => setTourTab(page.id)}
//                         className={`tour-nav-btn ${tourTab === page.id ? "active" : ""}`}
//                       >
//                         {page.icon}
//                         <span>{page.name}</span>
//                       </button>
//                     ))}
//                   </div>

//                   <div className="tour-content-panel">
//                     <div className="tour-content-image-mock">
//                       {tourPages.find(p => p.id === tourTab).previewText}
//                     </div>
//                     <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "800", color: "var(--text-main)" }}>
//                       {tourPages.find(p => p.id === tourTab).name} Workspace
//                     </h4>
//                     <p className="tour-content-desc">
//                       {tourPages.find(p => p.id === tourTab).desc}
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Step 4: Rocket launch */}
//               {currentStep === 4 && (
//                 <div className="rocket-launch-container">
//                   <div className="rocket-glow">
//                     <Rocket size={56} />
//                   </div>
//                   <h4 style={{ color: "var(--text-main)", fontWeight: "800", fontSize: "18px", margin: "0 0 8px 0" }}>
//                     Configure Vault Complete!
//                   </h4>
//                   <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.5", margin: 0, maxWidth: "440px" }}>
//                     Your ExoVault environment has been personalized with currency: <strong>{currency}</strong>, budget target: <strong>{currency}{Number(budget).toLocaleString()}</strong>, and <strong>{selectedCategories.length} categories</strong>. Let's make every rupee count!
//                   </p>
//                 </div>
//               )}

//             </motion.div>
//           </AnimatePresence>
//         </div>

//         {/* Footer Navigation */}
//         <div className="onboarding-footer">
//           <button 
//             onClick={handleBack} 
//             disabled={currentStep === 1}
//             style={{ 
//               background: "transparent", 
//               border: "1px solid var(--border)", 
//               color: currentStep === 1 ? "var(--text-muted)" : "var(--text-main)",
//               padding: "10px 20px", 
//               borderRadius: "12px", 
//               cursor: currentStep === 1 ? "not-allowed" : "pointer",
//               display: "flex",
//               alignItems: "center",
//               gap: "8px",
//               fontWeight: "800",
//               fontSize: "13px",
//               opacity: currentStep === 1 ? 0.5 : 1
//             }}
//           >
//             <ArrowLeft size={16} /> Back
//           </button>

//           <button 
//             onClick={handleNext}
//             className="btn-primary"
//             style={{ 
//               padding: "10px 24px", 
//               borderRadius: "12px", 
//               boxShadow: "0 10px 20px var(--primary-glow)",
//               display: "flex",
//               alignItems: "center",
//               gap: "8px",
//               fontWeight: "800",
//               fontSize: "13px"
//             }}
//           >
//             {currentStep === 4 ? (
//               <>Launch Vault <Rocket size={16} /></>
//             ) : (
//               <>Next Step <ArrowRight size={16} /></>
//             )}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
