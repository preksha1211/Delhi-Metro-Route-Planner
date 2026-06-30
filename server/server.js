const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const Graph = require("./algorithms/Graph");
const BFS = require("./algorithms/BFS");
const Dijkstra = require("./algorithms/Dijkstra");

const Station = require("./models/Stations");
const Connection = require("./models/Connection");

const app = express();
app.use(cors());
app.use(express.json());

// ─── Global instances ────────────────────────────────────────
let graph = new Graph();
let bfs = new BFS(graph);
let dijkstra = new Dijkstra(graph);

// ─── Load graph from MongoDB ──────────────────────────────────
async function loadGraph() {
    try {
        const connections = await Connection.find({});

        if (connections.length === 0) {
            console.warn("⚠️  No connections found in DB. Graph is empty.");
            return;
        }

        for (let conn of connections) {
            graph.addConnection(conn.from, conn.to, conn.time, conn.line, conn.fare);
        }

        console.log(`✅ Graph loaded — ${connections.length} connections`);
    } catch (err) {
        console.error("❌ Graph load failed:", err.message);
        process.exit(1);
    }
}

// ─── DB Connect + Server Start ────────────────────────────────
async function startServer() {
    await connectDB();
    await loadGraph();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

startServer();

// ════════════════════════════════════════════════════════════
//  ROUTES
// ════════════════════════════════════════════════════════════

// ─── GET all stations ─────────────────────────────────────────
app.get("/api/stations", async (req, res) => {
    try {
        const stations = await Station.find({}).sort({ name: 1 });
        res.json(stations);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch stations" });
    }
});

app.get("/api/debug/neighbors", (req, res) => {
    const station = req.query.station;
    const neighbors = graph.getNeighbors(station);
    res.json(neighbors);
});

// ─── POST find route ──────────────────────────────────────────
app.post("/api/route", (req, res) => {
    const { from, to, mode } = req.body;

    if (!from || !to || !mode) {
        return res.status(400).json({ error: "from, to aur mode required hain" });
    }

    if (from === to) {
        return res.status(400).json({ error: "From aur To same nahi ho sakte" });
    }

    if (!graph.adjList.has(from) || !graph.adjList.has(to)) {
        return res.status(404).json({ error: "Station graph mein nahi mila" });
    }

    try {
        let result;

        if (mode === "fewest") {
            const path = bfs.findShortestPath(from, to);
            if (!path || path.length === 0) {
                return res.status(404).json({ error: "Koi route nahi mila" });
            }
            const { totalTime, totalFare, changes, totalDistance } = getPathStats(path);
            result = {
                path,
                totalTime,
                totalFare,
                changes,
                totalDistance,
                lineSequence: getLineSequence(path),
            };

        } else if (mode === "cheapest") {
            result = dijkstra.findShortestPath(from, to, "fare");
            if (!result.path || result.path.length === 0) {
                return res.status(404).json({ error: "Koi route nahi mila" });
            }
            const stats = getPathStats(result.path);
            result.changes = stats.changes;
            result.totalDistance = stats.totalDistance;
            result.lineSequence = getLineSequence(result.path);

        } else if (mode === "fastest") {
            result = dijkstra.findShortestPath(from, to, "time");
            if (!result.path || result.path.length === 0) {
                return res.status(404).json({ error: "Koi route nahi mila" });
            }
            const stats = getPathStats(result.path);
            result.changes = stats.changes;
            result.totalDistance = stats.totalDistance;
            result.lineSequence = getLineSequence(result.path);

        } else if (mode === "interchange") {
            result = dijkstra.findLeastInterchange(from, to);
            if (!result.path || result.path.length === 0) {
                return res.status(404).json({ error: "Koi route nahi mila" });
            }
            const stats = getPathStats(result.path);
            result.changes = result.totalInterchanges;
            result.totalDistance = stats.totalDistance;

        } else {
            return res.status(400).json({ error: "Invalid mode" });
        }

        res.json(result);

    } catch (err) {
        console.error("Route error:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/debug/route", (req, res) => {
    const { from, to } = req.body;
    const path = bfs.findShortestPath(from, to);

    const edgeLines = [];
    for (let i = 0; i < path.length - 1; i++) {
        const neighbors = graph.getNeighbors(path[i]);
        const edge = neighbors.find(n => n.node === path[i + 1]);
        edgeLines.push({
            from: path[i],
            to: path[i + 1],
            line: edge ? edge.line : "NOT FOUND"
        });
    }
    res.json(edgeLines);
});

// ════════════════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════════════════

function getLineSequence(path) {
    const lines = [];
    for (let i = 0; i < path.length - 1; i++) {
        const neighbors = graph.getNeighbors(path[i]);
        const edge = neighbors
            .filter(n => n.node === path[i + 1])
            .reduce((best, e) => !best || e.time < best.time ? e : best, null);
        lines.push(edge ? edge.line : null);
    }
    return lines;
}

function getPathStats(path) {
    let totalTime = 0;
    let totalFare = 0;
    let changes = 0;
    let totalDistance = 0;
    let currentLine = null;

    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];

        const neighbors = graph.getNeighbors(from);
        const edges = neighbors.filter(n => n.node === to);
        const edge = edges.reduce((best, e) =>
            !best || e.time < best.time ? e : best, null
        );

        if (edge) {
            totalTime += edge.time;
            totalFare += edge.fare;
            totalDistance += edge.distance || 1.2;  // fallback 1.2 km per station

            if (currentLine === null) {
                currentLine = edge.line;
            } else if (edge.line !== currentLine) {
                changes++;
                currentLine = edge.line;
            }
        }
    }

    return {
        totalTime,
        totalFare,
        changes,
        totalDistance: parseFloat(totalDistance.toFixed(1)),
    };
}