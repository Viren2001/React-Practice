import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import {
    LayoutDashboard,
    ReceiptIndianRupee,
    BarChart3,
    Settings,
    LogOut,
    Sun,
    Moon,
    PlusCircle
} from "lucide-react";

function Sidebar() {
    const { logout, currentUser } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Failed to log out", error);
        }
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="logo">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div className="logo-icon" style={{
                            width: "32px",
                            height: "32px",
                            background: "linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px var(--primary-glow)",
                            flexShrink: 0
                        }}>
                             <PlusCircle size={18} color="white" />
                        </div>
                        <span className="logo-text">Tracker<span style={{ color: "var(--primary)" }}>.</span></span>
                    </div>
                </div>
            </div>

            <nav className="nav">
                <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span className="nav-label">Overview</span>
                </NavLink>
                <NavLink to="/expenses" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <ReceiptIndianRupee size={20} />
                    <span className="nav-label">Transactions</span>
                </NavLink>
                <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <BarChart3 size={20} />
                    <span className="nav-label">Analytics</span>
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Settings size={20} />
                    <span className="nav-label">Preferences</span>
                </NavLink>
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
    );
}

export default Sidebar;
