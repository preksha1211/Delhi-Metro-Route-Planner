import { useEffect, useState } from "react";
import { LINE_COLORS } from "./constants";

export default function GraphPage({ isDark, t, routePath }) {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/stations")
      .then((r) => r.json())
      .then((data) => {
        const unique = [...new Map(data.map((s) => [s.name, s])).values()];
        setStations(unique);
      })
      .catch(() => {});
  }, []);

  const lines = [...new Set(stations.map((s) => s.line))].sort();
  const inPath = (name) => routePath?.includes(name);

  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.cardBorder}`,
        borderRadius: 16,
        backdropFilter: "blur(18px)",
        padding: 22,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <h2 style={{ margin: 0, fontSize: 18, color: t.text }}>Metro Network Graph</h2>
        {routePath && routePath.length > 0 && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: t.accent,
              background: t.accentSoft,
              padding: "4px 10px",
              borderRadius: 8,
            }}
          >
            Selected route highlighted
          </span>
        )}
      </div>
      <p style={{ fontSize: 12, color: t.subtext, margin: "0 0 18px" }}>
        Stations grouped line-wise. Stations on your selected route glow and connect with a highlighted path.
      </p>

      {/* Highlighted route strip */}
      {routePath && routePath.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            overflowX: "auto",
            padding: "14px 6px 22px",
            marginBottom: 18,
            borderBottom: `1px solid ${t.cardBorder}`,
          }}
        >
          {routePath.map((name, idx) => {
            const station = stations.find((s) => s.name === name);
            const color = LINE_COLORS[station?.line] || t.accent;
            return (
              <div key={idx} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 90 }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: color,
                      boxShadow: `0 0 10px ${color}, 0 0 18px ${color}80`,
                      border: "2px solid #fff",
                    }}
                  />
                  <div style={{ fontSize: 11, color: t.text, marginTop: 6, textAlign: "center", maxWidth: 90 }}>
                    {name}
                  </div>
                </div>
                {idx < routePath.length - 1 && (
                  <div
                    style={{
                      width: 36,
                      height: 3,
                      background: color,
                      boxShadow: `0 0 6px ${color}`,
                      marginBottom: 18,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Full network grouped by line */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {lines.map((line) => (
          <div key={line}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: LINE_COLORS[line] || "#888" }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{line} Line</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingLeft: 18 }}>
              {stations
                .filter((s) => s.line === line)
                .map((s) => {
                  const active = inPath(s.name);
                  return (
                    <span
                      key={s._id}
                      style={{
                        fontSize: 12,
                        padding: "5px 10px",
                        borderRadius: 8,
                        color: active ? "#fff" : t.subtext,
                        background: active ? LINE_COLORS[line] : t.inputBg,
                        border: `1px solid ${active ? LINE_COLORS[line] : t.cardBorder}`,
                        boxShadow: active ? `0 0 10px ${LINE_COLORS[line]}80` : "none",
                        fontWeight: active ? 700 : 400,
                        transition: "all .2s",
                      }}
                    >
                      {s.name}
                    </span>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}