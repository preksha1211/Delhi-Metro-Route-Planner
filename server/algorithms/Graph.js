class Graph {
    constructor() {
        this.adjList = new Map();
    }

    addStation(station) {
        if (!this.adjList.has(station)) {
            this.adjList.set(station, []);
        }
    }

    addConnection(from, to, time, line, fare) {
        this.addStation(from);
        this.addStation(to);

        // ✅ Duplicate check — same from→to→line already hai?
        const existingFrom = this.adjList.get(from);
        if (!existingFrom.some(e => e.node === to && e.line === line)) {
            existingFrom.push({ node: to, time, line, fare });
        }

        const existingTo = this.adjList.get(to);
        if (!existingTo.some(e => e.node === from && e.line === line)) {
            existingTo.push({ node: from, time, line, fare });
        }
    }

    getNeighbors(station) {
        return this.adjList.get(station) || [];
    }
}

module.exports = Graph;