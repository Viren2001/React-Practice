import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { MoneyVaultSVG } from "./MoneyIcons";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    ReceiptIndianRupee,
    BarChart3,
    Settings,
    LogOut,
    Sun,
    Moon,
    Menu,
    X,
    ChevronRight,
    Sparkles
} from "lucide-react";

function Sidebar() {
    const { logout, currentUser } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [prevPathname, setPrevPathname] = useState(location.pathname);

    if (location.pathname !== prevPathname) {
        setPrevPathname(location.pathname);
        setIsMobileOpen(false);
    }

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileOpen]);

    async function handleLogout() {
        try {
            setIsMobileOpen(false);
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Failed to log out", error);
        }
    }

    const navLinks = [
        {
            path: "/",
            label: "Overview",
            icon: LayoutDashboard,
            desc: "Command Center & Wealth Gauge"
        },
        {
            path: "/expenses",
            label: "Transactions",
            icon: ReceiptIndianRupee,
            desc: "Full Ledger & Spending Records"
        },
        {
            path: "/reports",
            label: "Analytics",
            icon: BarChart3,
            desc: "Visual Insights & Trends"
        },
        {
            path: "/settings",
            label: "Preferences",
            icon: Settings,
            desc: "Budgets, Alerts & Themes"
        }
    ];

    return (
        <>
            {/* Desktop Sidebar (Rendered on large screens) */}
            <aside className="sidebar desktop-sidebar">
                <div className="sidebar-brand">
                    <div className="logo">
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div className="logo-icon" style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 0 20px var(--primary-glow)",
                                flexShrink: 0
                            }}>
                                <MoneyVaultSVG size={32} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span className="logo-text">EXOVAULT</span>
                                <span style={{ fontSize: "9px", letterSpacing: "1.5px", color: "var(--primary)", fontWeight: "800", marginTop: "-4px" }}>MONEY ANALYZER</span>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="nav">
                    {navLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/"}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <Icon size={20} />
                                <span className="nav-label">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <div className="theme-toggle-container">
                        <div className="sidebar-footer-label" style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Appearance</div>
                        <button
                            onClick={toggleTheme}
                            className="theme-btn"
                            title="Toggle Theme"
                        >
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>

                    {currentUser && (
                        <div className="user-info">
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "8px",
                                    background: "rgba(255,255,255,0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "800",
                                    fontSize: "14px",
                                    color: "white"
                                }}>
                                    {currentUser.email?.charAt(0).toUpperCase()}
                                </div>
                                <div className="user-email" style={{ flex: 1 }}>{currentUser.email}</div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                        title="Log Out"
                    >
                        <LogOut size={18} />
                        <span className="logout-label">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile & Tablet Header Bar (Rendered on screens < 1024px) */}
            <header className="mobile-header-bar">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(var(--primary-rgb), 0.15)",
                        boxShadow: "0 0 12px var(--primary-glow)"
                    }}>
                        <MoneyVaultSVG size={26} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "16px", fontWeight: "900", letterSpacing: "1.5px", color: "var(--text-main)" }}>EXOVAULT</span>
                        <span style={{ fontSize: "8px", letterSpacing: "1px", color: "var(--primary)", fontWeight: "800", marginTop: "-3px" }}>MONEY ANALYZER</span>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                        onClick={toggleTheme}
                        className="mobile-theme-btn"
                        title="Toggle Theme"
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Animated Burger Button */}
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className={`burger-toggle-btn ${isMobileOpen ? 'active' : ''}`}
                        aria-label="Toggle Navigation Menu"
                    >
                        <motion.div
                            animate={isMobileOpen ? "open" : "closed"}
                            style={{ display: "flex", flexDirection: "column", gap: "4px", width: "20px" }}
                        >
                            <motion.span
                                variants={{
                                    closed: { rotate: 0, y: 0 },
                                    open: { rotate: 45, y: 6 }
                                }}
                                transition={{ duration: 0.2 }}
                                style={{ display: "block", height: "2px", width: "100%", background: isMobileOpen ? "var(--primary)" : "var(--text-main)", borderRadius: "2px" }}
                            />
                            <motion.span
                                variants={{
                                    closed: { opacity: 1 },
                                    open: { opacity: 0 }
                                }}
                                transition={{ duration: 0.15 }}
                                style={{ display: "block", height: "2px", width: "100%", background: "var(--primary)", borderRadius: "2px" }}
                            />
                            <motion.span
                                variants={{
                                    closed: { rotate: 0, y: 0 },
                                    open: { rotate: -45, y: -6 }
                                }}
                                transition={{ duration: 0.2 }}
                                style={{ display: "block", height: "2px", width: "100%", background: isMobileOpen ? "var(--primary)" : "var(--text-main)", borderRadius: "2px" }}
                            />
                        </motion.div>
                    </button>
                </div>
            </header>

            {/* Mobile Burger Menu Fullscreen Drawer Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        className="burger-drawer-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <motion.div
                            className="burger-drawer-container"
                            initial={{ y: "-100%", opacity: 0 }}
                            animate={{ y: "0%", opacity: 1 }}
                            exit={{ y: "-100%", opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {/* Drawer Header */}
                            <div className="burger-drawer-header">
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{
                                        width: "36px",
                                        height: "36px",
                                        borderRadius: "10px",
                                        background: "linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 0 20px var(--primary-glow)"
                                    }}>
                                        <MoneyVaultSVG size={30} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "900", letterSpacing: "1px" }}>EXOVAULT</h3>
                                        <span style={{ fontSize: "9px", color: "var(--primary)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1.5px" }}>NAVIGATION MENU</span>
                                    </div>
                                </div>

                                {/* Unique Animated Close Button */}
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="unique-close-btn"
                                    title="Close Menu"
                                >
                                    <div className="close-btn-inner">
                                        <X size={20} />
                                    </div>
                                    <span className="close-btn-glow" />
                                </button>
                            </div>

                            {/* Drawer Page Links List */}
                            <div className="burger-drawer-body">
                                <div className="drawer-section-label">SELECT PAGE</div>
                                <div className="burger-nav-list">
                                    {navLinks.map((item, idx) => {
                                        const Icon = item.icon;
                                        return (
                                            <motion.div
                                                key={item.path}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.05 * idx, duration: 0.2 }}
                                            >
                                                <NavLink
                                                    to={item.path}
                                                    end={item.path === "/"}
                                                    onClick={() => setIsMobileOpen(false)}
                                                    className={({ isActive }) => `burger-nav-item ${isActive ? 'active' : ''}`}
                                                >
                                                    <div className="burger-item-icon">
                                                        <Icon size={22} />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div className="burger-item-title">{item.label}</div>
                                                        <div className="burger-item-desc">{item.desc}</div>
                                                    </div>
                                                    <ChevronRight size={18} className="burger-item-arrow" />
                                                </NavLink>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Drawer Footer */}
                            <div className="burger-drawer-footer">
                                {currentUser && (
                                    <div className="burger-user-card">
                                        <div className="burger-user-avatar">
                                            {currentUser.email?.charAt(0).toUpperCase()}
                                        </div>
                                        <div style={{ overflow: "hidden", flex: 1 }}>
                                            <div style={{ fontSize: "10px", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase" }}>Logged In As</div>
                                            <div className="burger-user-email">{currentUser.email}</div>
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                                    <button
                                        onClick={toggleTheme}
                                        className="burger-action-btn theme"
                                    >
                                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                                        <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                                    </button>

                                    {currentUser && (
                                        <button
                                            onClick={handleLogout}
                                            className="burger-action-btn logout"
                                        >
                                            <LogOut size={18} />
                                            <span>Sign Out</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default Sidebar;
