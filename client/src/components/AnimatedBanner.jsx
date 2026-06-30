export default function AnimatedBanner() {
  const buildings = [
    60, 45, 70, 55, 80, 50, 65, 40, 75, 52, 68, 48
  ];

  return (
    <div
      style={{
        position: "relative",
        height: 160,
        borderRadius: 18,
        overflow: "hidden",
        background: "linear-gradient(180deg, #bfe6ff 0%, #eaf6ff 60%, #ffffff 100%)",
      }}
    >
      <style>{`
        @keyframes moveCloud {
          0% { transform: translateX(-120px); }
          100% { transform: translateX(120%); }
        }

        @keyframes trainMove {
          0% { transform: translateX(-200px); }
          100% { transform: translateX(120%); }
        }
      `}</style>

      {/* SUN */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 18,
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: "radial-gradient(circle, #fff7b0, #fbbf24)",
          boxShadow: "0 0 25px rgba(251,191,36,0.6)",
        }}
      />

      {/* CLOUDS */}
      {[20, 45, 70].map((top, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top,
            left: "-100px",
            width: 70,
            height: 20,
            background: "#ffffff",
            borderRadius: 20,
            opacity: 0.9,
            filter: "blur(0.2px)",
            animation: `moveCloud ${18 + i * 6}s linear infinite`,
          }}
        />
      ))}

      {/* SKYLINE */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "0 10px",
        }}
      >
        {buildings.map((h, i) => (
          <div
            key={i}
            style={{
              width: 18,
              height: h,
              background: "#93c5fd",
              opacity: 0.6,
              borderRadius: "3px 3px 0 0",
              position: "relative",
            }}
          >
            {/* windows (subtle like image) */}
            <div
              style={{
                position: "absolute",
                inset: "6px",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 3,
              }}
            >
              {Array.from({ length: 6 }).map((_, j) => (
                <span
                  key={j}
                  style={{
                    width: 2,
                    height: 2,
                    background: "#e0f2fe",
                    opacity: 0.7,
                    borderRadius: 1,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* TREES (left & right like image) */}
      <div style={{ position: "absolute", bottom: 38, left: 10 }}>
        <div style={{ fontSize: 18 }}>🌳</div>
      </div>
      <div style={{ position: "absolute", bottom: 38, right: 10 }}>
        <div style={{ fontSize: 18 }}>🌳</div>
      </div>

      {/* TRACK */}
      <div
        style={{
          position: "absolute",
          bottom: 22,
          left: 0,
          right: 0,
          height: 3,
          background: "#94a3b8",
          opacity: 0.6,
        }}
      />

      {/* TRAIN */}
      <div
        style={{
          position: "absolute",
          bottom: 26,
          animation: "trainMove 8s linear infinite",
        }}
      >
        <svg width="120" height="30" viewBox="0 0 120 30">
          {/* body */}
          <rect x="0" y="6" width="55" height="18" rx="4" fill="#ffffff" />
          <rect x="58" y="6" width="55" height="18" rx="4" fill="#ffffff" />

          {/* blue stripe like metro */}
          <rect x="0" y="12" width="113" height="4" fill="#38bdf8" />

          {/* windows */}
          <rect x="8" y="10" width="10" height="6" fill="#bae6fd" />
          <rect x="22" y="10" width="10" height="6" fill="#bae6fd" />
          <rect x="36" y="10" width="10" height="6" fill="#bae6fd" />

          <rect x="66" y="10" width="10" height="6" fill="#bae6fd" />
          <rect x="80" y="10" width="10" height="6" fill="#bae6fd" />
          <rect x="94" y="10" width="10" height="6" fill="#bae6fd" />

          {/* wheels */}
          <circle cx="15" cy="26" r="3" fill="#1e293b" />
          <circle cx="45" cy="26" r="3" fill="#1e293b" />
          <circle cx="75" cy="26" r="3" fill="#1e293b" />
          <circle cx="105" cy="26" r="3" fill="#1e293b" />
        </svg>
      </div>
    </div>
  );
}