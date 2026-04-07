function PageHeader({ title, subtitle }) {
    return (
        <div className="page-header-container" style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "clamp(24px, 5vw, 32px)", color: "var(--text-main)", marginBottom: "4px", fontWeight: "900", letterSpacing: "-0.04em" }}>{title}</h1>
            <p style={{ fontSize: "clamp(13px, 3vw, 15px)", color: "var(--text-muted)", fontWeight: "500" }}>{subtitle}</p>
        </div>
    );
}

export default PageHeader;

