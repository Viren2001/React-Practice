import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Sidebar() {
    const { logout, currentUser } = useAuth();
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
            <div className="logo">
                💰 Tracker
                <span>Personal Finance</span>
            </div>

            <nav className="nav">
                <NavLink to="/" end className="nav-item">
                    Dashboard
                </NavLink>
                <NavLink to="/expenses" className="nav-item">
                    Expenses
                </NavLink>
                <NavLink to="/reports" className="nav-item">
                    Reports
                </NavLink>
            </nav>

            <div className="sidebar-footer" style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                {currentUser && <div style={{color: "#9ca3af", fontSize:"12px"}}>{currentUser.email}</div>}
                <button 
                    onClick={handleLogout} 
                    style={{ background: "#dc2626", color: "white", border: "none", padding: "8px", borderRadius: "8px", cursor: "pointer", width: "100%" }}
                >
                    Log Out
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
