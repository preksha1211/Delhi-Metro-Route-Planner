class BFS {
    constructor(graph) {
        this.graph = graph;
    }

    // ── Fewest Stations — simple BFS ──────────────────────────
    findShortestPath(start, end) {
        let queue = [start];
        let visited = new Set([start]);
        let parent = { [start]: null };

        while (queue.length > 0) {
            let current = queue.shift();
            if (current === end) break;

            for (let neighbor of this.graph.getNeighbors(current)) {
                let node = neighbor.node;
                if (!visited.has(node)) {
                    visited.add(node);
                    queue.push(node);
                    parent[node] = current;
                }
            }
        }

        if (parent[end] === undefined && start !== end) return [];

        let path = [];
        let curr = end;
        while (curr !== null) { path.push(curr); curr = parent[curr]; }
        return path.reverse();
    }

    // ── Least Interchange — Dijkstra style, changes minimize karo ──
    findLeastInterchange(start, end, graph) {
        // priority queue: [changes, station, line, path]
        let pq = [{ changes: 0, station: start, line: null, path: [start] }];

        // best changes found for each {station, line} state
        let best = new Map();

        while (pq.length > 0) {
            // sort by changes — minimum pehle
            pq.sort((a, b) => a.changes - b.changes);
            let { changes, station, line, path } = pq.shift();

            // destination pahunch gaye
            if (station === end) {
                return { path, changes };
            }

            let stateKey = `${station}|${line}`;
            if (best.has(stateKey) && best.get(stateKey) <= changes) continue;
            best.set(stateKey, changes);

            for (let neighbor of graph.getNeighbors(station)) {
                let newChanges = (line && line !== neighbor.line)
                    ? changes + 1
                    : changes;

                let newStateKey = `${neighbor.node}|${neighbor.line}`;
                if (best.has(newStateKey) && best.get(newStateKey) <= newChanges) continue;

                pq.push({
                    changes: newChanges,
                    station: neighbor.node,
                    line: neighbor.line,
                    path: [...path, neighbor.node]
                });
            }
        }

        return { path: [], changes: 0 };
    }
}

module.exports = BFS;