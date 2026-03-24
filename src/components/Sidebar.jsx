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
    Moon
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
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: "#2563eb",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            flexShrink: 0
                        }}>💰</div>
                        <span className="logo-text">Tracker</span>
                    </div>
                </div>
            </div>

            <nav className="nav">
                <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span className="nav-label">Dashboard</span>
                </NavLink>
                <NavLink to="/expenses" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <ReceiptIndianRupee size={20} />
                    <span className="nav-label">Expenses</span>
                </NavLink>
                <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <BarChart3 size={20} />
                    <span className="nav-label">Reports</span>
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Settings size={20} />
                    <span className="nav-label">Settings</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <div className="theme-toggle-container">
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
                        <div className="user-email">{currentUser.email}</div>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className="logout-btn"
                    title="Log Out"
                >
                    <LogOut size={18} />
                    <span className="logout-label">Log Out</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
