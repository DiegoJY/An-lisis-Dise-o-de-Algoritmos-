const { performance } = require('node:perf_hooks');

class UnionFind {
  constructor(elements) {
    this.parent = new Map();
    this.rank = new Map();
    elements.forEach(el => {
      this.parent.set(el, el);
      this.rank.set(el, 0);
    });
  }
  find(item) {
    if (this.parent.get(item) !== item) {
      this.parent.set(item, this.find(this.parent.get(item)));
    }
    return this.parent.get(item);
  }
  union(itemA, itemB) {
    const rootA = this.find(itemA);
    const rootB = this.find(itemB);
    if (rootA === rootB) return false;
    const rankA = this.rank.get(rootA);
    const rankB = this.rank.get(rootB);
    if (rankA < rankB) {
      this.parent.set(rootA, rootB);
    } else if (rankA > rankB) {
      this.parent.set(rootB, rootA);
    } else {
      this.parent.set(rootB, rootA);
      this.rank.set(rootA, rankA + 1);
    }
    return true;
  }
}

function kruskal(graph, weightKey = 'distance') {
  const startMs = performance.now();
  const nodes = graph.nodes;
  let edges = [...graph.edges];
  const steps = [];

  if (nodes.length === 0) return { applicable: false, steps: [] };

  steps.push({ stepCode: 'INIT', description: 'Iniciando estructuras disjuntas (Union-Find).' });

  edges.sort((a, b) => (a[weightKey] || 0) - (b[weightKey] || 0));
  steps.push({ stepCode: 'SORT_EDGES', description: 'Aristas ordenadas por peso de menor a mayor.' });

  const uf = new UnionFind(nodes.map(n => n.id));
  const mstEdges = [];
  let totalCost = 0;
  const visitedNodes = new Set();

  for (const edge of edges) {
    const u = edge.sourceId || edge.fromId || edge.source_id;
    const v = edge.targetId || edge.toId || edge.target_id;
    const weight = edge[weightKey] || 0;

    steps.push({ stepCode: 'EVALUATE_EDGE', activeEdge: edge.id, activeNode: u, targetNode: v, description: `Evaluando arista entre ${u} y ${v}` });

    if (uf.union(u, v)) {
      mstEdges.push(edge.id);
      totalCost += weight;
      visitedNodes.add(u);
      visitedNodes.add(v);
      steps.push({ stepCode: 'UNION_EDGE', activeEdge: edge.id, description: `Arista agregada al MST. No forma ciclos.` });
    } else {
      steps.push({ stepCode: 'CYCLE_DETECTED', activeEdge: edge.id, description: `Descartada: Forma un ciclo.` });
    }

    if (mstEdges.length === nodes.length - 1) break;
  }

  return {
    algorithm: 'kruskal',
    type: 'mst',
    applicable: mstEdges.length > 0,
    selectedEdges: mstEdges,
    totalCost: Number(totalCost.toFixed(4)),
    visitedCount: visitedNodes.size,
    executionMs: Number((performance.now() - startMs).toFixed(4)),
    steps
  };
}

module.exports = kruskal;