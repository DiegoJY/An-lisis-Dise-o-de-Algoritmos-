const api = {
    async runAlgorithm(data) {
        try {
            let response = await fetch('/api/algorithms/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.status === 404) {
                response = await fetch('/api/algorithms', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            
            return await response.json();
        } catch (error) {
            console.error(error);
            return { ok: false };
        }
    },

    async getHistory() {
        try {
            const response = await fetch('/api/history');
            return await response.json();
        } catch (error) {
            return [];
        }
    },

    async getGraph() {
        try {
            const response = await fetch('/api/graph');
            if (!response.ok) return { nodes: [], edges: [] };
            return await response.json();
        } catch (error) {
            console.error(error);
            return { nodes: [], edges: [] };
        }
    }
};

export default api;