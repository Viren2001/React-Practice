function PageHeader({ title, subtitle }) {
    return (
        <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "32px", color: "var(--text-main)", marginBottom: "4px" }}>{title}</h1>
            <p style={{ fontSize: "15px", color: "var(--text-muted)", fontWeight: "500" }}>{subtitle}</p>
        </div>
    );
}

export default PageHeader;

