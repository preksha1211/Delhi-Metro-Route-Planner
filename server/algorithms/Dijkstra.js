class Dijkstra {
    constructor(graph) {
        this.graph = graph;
    }

    getMinDistanceNode(distances, visited) {
        let minNode = null;
        let minDistance = Infinity;
        for (let node in distances) {
            if (!visited.has(node) && distances[node] < minDistance) {
                minDistance = distances[node];
                minNode = node;
            }
        }
        return minNode;
    }

    // weightKey = 'time' or 'fare'
    findShortestPath(start, end, weightKey = 'time') {
        let dist = {};
        let time = {};
        let fare = {};
        let parent = {};
        let visited = new Set();

        for (let station of this.graph.adjList.keys()) {
            dist[station] = Infinity;
            time[station] = Infinity;
            fare[station] = Infinity;
            parent[station] = null;
        }

        dist[start] = 0;
        time[start] = 0;
        fare[start] = 0;

        while (true) {
            let current = this.getMinDistanceNode(dist, visited);
            if (current === null || current === end) break;
            visited.add(current);

            for (let neighbor of this.graph.getNeighbors(current)) {
                let next = neighbor.node;
                let newDist = dist[current] + neighbor[weightKey];

                if (newDist < dist[next]) {
                    dist[next] = newDist;
                    time[next] = time[current] + neighbor.time;
                    fare[next] = fare[current] + neighbor.fare;
                    parent[next] = current;
                }
            }
        }

        return this._buildResult(start, end, parent, time, fare);
    }

    _buildResult(start, end, parent, time, fare) {
        if (parent[end] === undefined && start !== end) {
            return { path: [], totalTime: 0, totalFare: 0 };
        }
        let path = [];
        let curr = end;
        while (curr !== null) {
            path.push(curr);
            curr = parent[curr];
        }
        path.reverse();
        return { path, totalTime: time[end], totalFare: fare[end] };
    }

    // ✅ Least Interchange Algorithm
    // State = (station, currentLine) — taaki same station alag lines pe alag treat ho
    findLeastInterchange(start, end) {
        // best[station|line] = { interchanges, time, fare, parent, parentLine }
        const best = {};
        // queue items: { station, line, interchanges, time, fare, parent, parentLine }
        const queue = [];

        const key = (station, line) => `${station}|${line}`;

        // Start: sabse pehli edge ki line se shuru karo
        const startNeighbors = this.graph.getNeighbors(start);
        const startLines = [...new Set(startNeighbors.map(n => n.line))];

        for (const line of startLines) {
            const k = key(start, line);
            const node = { station: start, line, interchanges: 0, time: 0, fare: 0, stops: 0, parent: null, parentLine: null };
            best[k] = node;
            queue.push(node);
        }

        while (queue.length > 0) {
            // Min-priority: pehle kam interchange, phir kam stops, phir kam time
            queue.sort((a, b) =>
                a.interchanges - b.interchanges ||
                a.stops - b.stops ||
                a.time - b.time
            );
            const curr = queue.shift();

            // Destination pahunch gaye
            if (curr.station === end) {
                return this._buildInterchangeResult(curr, best, key);
            }

            for (const neighbor of this.graph.getNeighbors(curr.station)) {
                // ✅ FIX: Sirf same line ki edges follow karo JBTK possible ho.
                // Interchange tab karo jab neighbor edge ki line current line se alag ho.
                // Lekin same station pe baar baar line change mat karo —
                // ek baar change hone ke baad naye line se continue karo.
                const isSameStation = neighbor.node === curr.station;
                if (isSameStation) continue; // self-loop skip

                const isInterchange = neighbor.line !== curr.line;
                const newInterchanges = curr.interchanges + (isInterchange ? 1 : 0);
                const newTime = curr.time + neighbor.time;
                const newFare = curr.fare + neighbor.fare;
                const newStops = curr.stops + 1;
                const nKey = key(neighbor.node, neighbor.line);

                const existing = best[nKey];
                const isBetter =
                    !existing ||
                    newInterchanges < existing.interchanges ||
                    (newInterchanges === existing.interchanges && newStops < existing.stops) ||
                    (newInterchanges === existing.interchanges && newStops === existing.stops && newTime < existing.time);

                if (isBetter) {
                    const node = {
                        station: neighbor.node,
                        line: neighbor.line,
                        interchanges: newInterchanges,
                        time: newTime,
                        fare: newFare,
                        stops: newStops,
                        parent: curr.station,
                        parentLine: curr.line,
                    };
                    best[nKey] = node;
                    queue.push(node);
                }
            }
        }

        return { path: [], totalTime: 0, totalFare: 0, totalInterchanges: 0 };
    }

    _buildInterchangeResult(endNode, best, keyFn) {
        const pathNodes = []; // { station, line } pairs
        let curr = endNode;

        while (curr) {
            pathNodes.unshift({ station: curr.station, line: curr.line });
            if (curr.parent === null) break;
            const parentKey = keyFn(curr.parent, curr.parentLine);
            curr = best[parentKey] || null;
        }

        const path = pathNodes.map(n => n.station);

        // lineSequence[i] = line used on edge from path[i] to path[i+1]
        // pathNodes[i].line = line we were ON at node i
        // But the edge line is pathNodes[i+1].line (the line we arrived on)
        const lineSequence = [];
        for (let i = 0; i < pathNodes.length - 1; i++) {
            lineSequence.push(pathNodes[i + 1].line);
        }

        return {
            path,
            lineSequence,
            totalTime: endNode.time,
            totalFare: endNode.fare,
            totalInterchanges: endNode.interchanges,
        };
    }
}

module.exports = Dijkstra;