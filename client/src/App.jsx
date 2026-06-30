import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import AnimatedBanner from "./components/AnimatedBanner";
import RouteForm from "./components/RouteForm";
import RoutePanel from "./components/RoutePanel";
import GraphPage from "./components/GraphPage";
import { theme } from "./components/theme";

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [page, setPage] = useState("route");
  const [stations, setStations] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [mode, setMode] = useState("fastest");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPanel, setShowPanel] = useState(false);

  const t = isDark ? theme.dark : theme.light;

  useEffect(() => {
    fetch("http://localhost:5000/api/stations")
      .then((r) => r.json())
      .then((data) => {
        const unique = [...new Map(data.map((s) => [s.name, s])).values()];
        unique.sort((a, b) => a.name.localeCompare(b.name));
        setStations(unique);
      })
      .catch(() =>
        setError("Server se stations load nahi hue. Server chalu hai?")
      );
  }, []);

  const findRoute = async () => {
    if (!from || !to) {
      setError("From aur To station select karo");
      return;
    }

    if (from === to) {
      setError("From aur To alag hone chahiye");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);
    setShowPanel(false);

    try {
      const res = await fetch("http://localhost:5000/api/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to,
          mode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Koi route nahi mila");
      } else {
        setResult(data);
        setTimeout(() => setShowPanel(true), 80);
      }
    } catch {
      setError("Server se connect nahi ho pa raha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: t.bg,
        transition: "0.3s",
      }}
    >
      <Sidebar
        page={page}
        setPage={setPage}
        isDark={isDark}
        setIsDark={setIsDark}
        t={t}
      />

      <main
        style={{
          flex: 1,
          width: "100%",
          padding: 24,
          minWidth: 0,
        }}
      >
        {page === "graph" ? (
          <GraphPage
            isDark={isDark}
            t={t}
            routePath={result?.path}
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: result ? "2fr 1fr" : "1fr",
              gap: 20,
              width: "100%",
              alignItems: "start",
            }}
          >
            {/* LEFT */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                minWidth: 0,
              }}
            >
              <AnimatedBanner isDark={isDark} t={t} />

              <RouteForm
                isDark={isDark}
                t={t}
                stations={stations}
                from={from}
                to={to}
                setFrom={setFrom}
                setTo={setTo}
                mode={mode}
                setMode={setMode}
                result={result}
                loading={loading}
                error={error}
                onFindRoute={findRoute}
              />
            </div>

            {/* RIGHT */}
            {result && (
              <RoutePanel
                result={result}
                from={from}
                to={to}
                mode={mode}
                t={t}
                visible={showPanel}
                onBack={() => {
                  setShowPanel(false);
                  setTimeout(() => setResult(null), 300);
                }}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}