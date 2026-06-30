import { useState } from "react";
import { LINE_COLORS, MODES } from "./constants";

export default function RouteForm({
  isDark,
  t,
  stations,
  from,
  to,
  setFrom,
  setTo,
  mode,
  setMode,
  result,
  loading,
  error,
  onFindRoute,
}) {
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [showFromList, setShowFromList] = useState(false);
  const [showToList, setShowToList] = useState(false);

  const filteredFrom = stations.filter((s) =>
    s.name.toLowerCase().includes(fromSearch.toLowerCase())
  );
  const filteredTo = stations.filter((s) =>
    s.name.toLowerCase().includes(toSearch.toLowerCase())
  );

  const cardStyle = (active) => ({
    flex: 1,
    minWidth: 130,
    padding: "12px 14px",
    borderRadius: 12,
    border: active ? `1px solid ${t.accent}` : `1px solid ${t.cardBorder}`,
    background: active ? "linear-gradient(135deg,#6366f1,#4f46e5)" : t.cardBg,
    color: active ? "#fff" : t.text,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 10,
    transition: "all .15s",
    boxShadow: active ? "0 4px 16px rgba(99,102,241,0.4)" : "none",
  });

  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.cardBorder}`,
        borderRadius: 16,
        backdropFilter: "blur(18px)",
        padding: 20,
      }}
    >
      {/* Source / Destination */}
      <div style={{ display: "flex", gap: 14, alignItems: "flex-end", marginBottom: 20 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <label style={labelStyle(t)}>Source</label>
          <input
            style={inputStyle(t)}
            placeholder="Search station..."
            value={fromSearch || from}
            onChange={(e) => {
              setFromSearch(e.target.value);
              setFrom("");
              setShowFromList(true);
            }}
            onFocus={() => setShowFromList(true)}
            onBlur={() => setTimeout(() => setShowFromList(false), 150)}
          />
          {showFromList && fromSearch && (
            <ul style={dropdownStyle(t)}>
              {filteredFrom.slice(0, 8).map((s) => (
                <li
                  key={s._id}
                  style={dropdownItemStyle(t)}
                  onMouseDown={() => {
                    setFrom(s.name);
                    setFromSearch(s.name);
                    setShowFromList(false);
                  }}
                >
                  <span style={dotStyle(LINE_COLORS[s.line])} />
                  {s.name}
                </li>
              ))}
              {filteredFrom.length === 0 && (
                <li style={{ ...dropdownItemStyle(t), color: "#888" }}>No stations found</li>
              )}
            </ul>
          )}
        </div>

        <button
          title="Swap"
          onClick={() => {
            const tmp = from;
            setFrom(to);
            setTo(tmp);
            const tmpS = fromSearch;
            setFromSearch(toSearch);
            setToSearch(tmpS);
          }}
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: `1px solid ${t.accent}`,
            background: t.accentSoft,
            color: t.accent,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          ⇄
        </button>

        <div style={{ flex: 1, position: "relative" }}>
          <label style={labelStyle(t)}>Destination</label>
          <input
            style={inputStyle(t)}
            placeholder="Search station..."
            value={toSearch || to}
            onChange={(e) => {
              setToSearch(e.target.value);
              setTo("");
              setShowToList(true);
            }}
            onFocus={() => setShowToList(true)}
            onBlur={() => setTimeout(() => setShowToList(false), 150)}
          />
          {showToList && toSearch && (
            <ul style={dropdownStyle(t)}>
              {filteredTo.slice(0, 8).map((s) => (
                <li
                  key={s._id}
                  style={dropdownItemStyle(t)}
                  onMouseDown={() => {
                    setTo(s.name);
                    setToSearch(s.name);
                    setShowToList(false);
                  }}
                >
                  <span style={dotStyle(LINE_COLORS[s.line])} />
                  {s.name}
                </li>
              ))}
              {filteredTo.length === 0 && (
                <li style={{ ...dropdownItemStyle(t), color: "#888" }}>No stations found</li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Route Preference */}
      <p style={{ fontSize: 13, fontWeight: 600, color: t.subtext, margin: "0 0 10px" }}>
        Route Preference <span style={{ color: t.subtext, fontWeight: 400 }}>(Choose your priority)</span>
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {MODES.map((m) => (
          <div key={m.key} style={cardStyle(mode === m.key)} onClick={() => setMode(m.key)}>
            <span style={{ fontSize: 18 }}>{m.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{m.label}</div>
              <div style={{ fontSize: 11, opacity: 0.85 }}>{m.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 10,
            padding: "10px 14px",
            color: "#fca5a5",
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {/* Quick stats + view route */}
      <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
        {[
          { label: "Total Time", val: result ? `${result.totalTime} min` : "—" },
          { label: "Total Fare", val: result ? `₹${result.totalFare}` : "—" },
          { label: "Total Stations", val: result ? result.path.length : "—" },
          { label: "Interchanges", val: result ? result.changes : "—" },
        ].map((s) => (
          <div key={s.label} style={{ minWidth: 110 }}>
            <div style={{ fontSize: 11, color: t.subtext }}>{s.label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>{s.val}</div>
          </div>
        ))}

        <button
          onClick={onFindRoute}
          disabled={loading}
          style={{
            marginLeft: "auto",
            padding: "12px 26px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg,#6366f1,#3b82f6)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 4px 18px rgba(99,102,241,0.4)",
          }}
        >
          {loading ? "Finding..." : "View Route →"}
        </button>
      </div>
    </div>
  );
}

function labelStyle(t) {
  return { fontSize: 11, fontWeight: 600, color: t.subtext, letterSpacing: "0.06em", display: "block", marginBottom: 6 };
}
function inputStyle(t) {
  return {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    background: t.inputBg,
    border: `1px solid ${t.inputBorder}`,
    color: t.text,
    fontSize: 14,
    outline: "none",
  };
}
function dropdownStyle(t) {
  return {
    listStyle: "none",
    position: "absolute",
    width: "100%",
    margin: "6px 0 0",
    padding: 6,
    background: t.cardBg,
    backdropFilter: "blur(14px)",
    border: `1px solid ${t.cardBorder}`,
    borderRadius: 12,
    maxHeight: 220,
    overflowY: "auto",
    zIndex: 50,
  };
}
function dropdownItemStyle(t) {
  return {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    fontSize: 13,
    color: t.text,
    cursor: "pointer",
    borderRadius: 8,
  };
}
function dotStyle(color) {
  return { width: 9, height: 9, borderRadius: "50%", background: color || "#888" };
}