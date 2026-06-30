import { LINE_COLORS, MODES } from "./constants";

export default function RoutePanel({
  result,
  from,
  to,
  mode,
  t,
  onBack,
  visible,
}) {
  if (!result || !result.path) return null;

  const path = result.path;
  const usedLines = [...new Set(result.lineSequence?.filter(Boolean))];
  const modeLabel =
    MODES.find((m) => m.key === mode)?.label || mode;

  return (
    <div
      style={{
        width: "100%",
        background: t.cardBg,
        border: `1px solid ${t.cardBorder}`,
        borderRadius: 16,
        backdropFilter: "blur(18px)",
        padding: 20,
        boxSizing: "border-box",
        position: "sticky",
        top: 24,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        transform: visible ? "translateX(0)" : "translateX(40px)",
        opacity: visible ? 1 : 0,
        transition: "all .35s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: t.text,
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {from}
          <span style={{ color: t.subtext }}>→</span>
          {to}

          <span
            style={{
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 8,
              background: t.accentSoft,
              color: t.accent,
              fontWeight: 700,
            }}
          >
            {modeLabel}
          </span>
        </div>

        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: `1px solid ${t.cardBorder}`,
            color: t.text,
            padding: "8px 14px",
            borderRadius: 10,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          ← Back
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {[
          {
            label: "Total Time",
            value: `${result.totalTime} min`,
          },
          {
            label: "Total Fare",
            value: `₹${result.totalFare}`,
          },
          {
            label: "Total Stations",
            value: path.length,
          },
          {
            label: "Interchanges",
            value: result.changes,
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: t.accentSoft,
              border: `1px solid ${t.cardBorder}`,
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: t.subtext,
              }}
            >
              {item.label}
            </div>

            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: t.text,
                marginTop: 6,
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div
        style={{
          maxHeight: "55vh",
          overflowY: "auto",
          paddingRight: 6,
        }}
      >
        {path.map((station, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === path.length - 1;

          const prevLine =
            idx > 0 ? result.lineSequence?.[idx - 1] : null;

          const currLine = result.lineSequence?.[idx];

          const isInterchange =
            !isLast &&
            prevLine &&
            currLine &&
            prevLine !== currLine;

          const dotColor =
            LINE_COLORS[isLast ? prevLine : currLine] ||
            t.subtext;

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                minHeight: 34,
              }}
            >
              <div
                style={{
                  width: 95,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {isFirst && (
                  <Badge
                    color="#22c55e"
                    text="Start"
                  />
                )}

                {isLast && (
                  <Badge
                    color="#ef4444"
                    text="End"
                  />
                )}

                {isInterchange && (
                  <Badge
                    color={
                      LINE_COLORS[currLine] ||
                      "#f97316"
                    }
                    text={`→ ${currLine}`}
                  />
                )}
              </div>

              <div
                style={{
                  width: 16,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {!isFirst && (
                  <div
                    style={{
                      width: 2,
                      height: 10,
                      background:
                        LINE_COLORS[prevLine] || "#888",
                    }}
                  />
                )}

                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    border: `2px solid ${dotColor}`,
                    background:
                      isFirst || isLast
                        ? dotColor
                        : "transparent",
                  }}
                />

                {!isLast && (
                  <div
                    style={{
                      width: 2,
                      height: 10,
                      background:
                        LINE_COLORS[currLine] || "#888",
                    }}
                  />
                )}
              </div>

              <div
                style={{
                  color: t.text,
                  fontSize: 14,
                }}
              >
                {station}
              </div>
            </div>
          );
        })}
      </div>

      {/* Color Guide */}
      <div
        style={{
          marginTop: "auto",
          background: t.accentSoft,
          border: `1px solid ${t.cardBorder}`,
          borderRadius: 12,
          padding: 14,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            marginBottom: 10,
            color: t.text,
          }}
        >
          Route Color Guide
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {usedLines.map((line) => (
            <div
              key={line}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                color: t.text,
                fontSize: 13,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background:
                    LINE_COLORS[line] || "#888",
                }}
              />
              {line} Line
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Badge({ color, text }) {
  return (
    <span
      style={{
        background: color,
        color: "#fff",
        fontSize: 10,
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: 6,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}