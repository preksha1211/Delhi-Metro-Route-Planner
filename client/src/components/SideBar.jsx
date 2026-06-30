export default function Sidebar({ page, setPage, isDark, setIsDark, t }) {
  return (
    <aside
      style={{
        width: 72,
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        background: t.sidebarBg,
        backdropFilter: "blur(18px)",
        borderRight: `1px solid ${t.cardBorder}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 0",
        zIndex: 200,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: "linear-gradient(135deg,#6366f1,#3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            boxShadow: "0 0 14px rgba(99,102,241,0.5)",
          }}
        >
          🚇
        </div>

        <button
          onClick={() => setPage("route")}
          title="Route"
          style={navBtnStyle(page === "route", t)}
        >
          ⇄
        </button>

        <button
          onClick={() => setPage("graph")}
          title="Graph"
          style={navBtnStyle(page === "graph", t)}
        >
          🔗
        </button>
      </div>

      <button
        onClick={() => setIsDark(!isDark)}
        title="Toggle theme"
        style={{
          width: 42,
          height: 24,
          borderRadius: 14,
          border: "none",
          background: isDark ? "#334155" : "#fbbf24",
          position: "relative",
          cursor: "pointer",
          transition: "background .25s",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: isDark ? 2 : 20,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#fff",
            transition: "left .25s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
          }}
        >
          {isDark ? "🌙" : "☀️"}
        </span>
      </button>
    </aside>
  );
}

function navBtnStyle(active, t) {
  return {
    width: 44,
    height: 44,
    borderRadius: 12,
    border: active ? `1px solid ${t.accent}` : `1px solid ${t.cardBorder}`,
    background: active ? t.accentSoft : "transparent",
    color: active ? t.accent : t.subtext,
    fontSize: 18,
    cursor: "pointer",
    transition: "all .2s",
  };
}