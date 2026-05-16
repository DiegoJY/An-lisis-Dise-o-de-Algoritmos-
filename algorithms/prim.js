const { performance } = require('node:perf_hooks');
const { buildAdjacency, getNodeMap } = require('../utils/graphUtils');
const MinHeap = require('./MinHeap');

function prim(graph, originId, weightKey = 'distance') {
  const startMs = performance.now();
  const nodes = graph.nodes;
  const edges = graph.edges;
  const nodeMap = getNodeMap(nodes);
  const steps = [];

  let startNodeId = originId;
  if (!startNodeId || !nodeMap.has(startNodeId)) {
    if (nodes.length === 0) return { applicable: false, steps: [] };
    startNodeId = nodes[0].id;
  }

  const adjacency = buildAdjacency(nodes, edges, weightKey);
  const visited = new Set();
  const pq = new MinHeap();
  const mstEdges = [];
  let totalCost = 0;

  visited.add(startNodeId);
  steps.push({ stepCode: 'INIT', activeNode: startNodeId, description: `Iniciando Prim desde nodo ${startNodeId}` });

  const initialNeighbors = adjacency.get(startNodeId) || [];
  for (const item of initialNeighbors) {
    pq.insert(item.to, item.weight, { edgeId: item.edgeId, from: startNodeId, to: item.to });
  }

  while (!pq.isEmpty() && visited.size < nodes.length) {
    const minEdge = pq.extractMin();
    const { to, edgeId, from } = minEdge.payload;
    const weight = minEdge.weight;

    steps.push({ stepCode: 'EXTRACT_MIN', activeNode: from, targetNode: to, activeEdge: edgeId, description: `Evaluando arista de menor peso hacia ${to}` });

    if (visited.has(to)) {
      steps.push({ stepCode: 'CYCLE_DETECTED', activeNode: to, description: `El nodo ${to} ya está en el MST. Descartando arista.` });
      continue;
    }

    visited.add(to);
    mstEdges.push(edgeId);
    totalCost += weight;

    steps.push({ stepCode: 'UNION_EDGE', activeNode: to, activeEdge: edgeId, description: `Nodo ${to} agregado al MST.` });

    const neighbors = adjacency.get(to) || [];
    for (const item of neighbors) {
      if (!visited.has(item.to)) {
        steps.push({ stepCode: 'EVALUATE_NEIGHBOR', activeNode: to, targetNode: item.to, description: `Encolando vecino ${item.to}` });
        pq.insert(item.to, item.weight, { edgeId: item.edgeId, from: to, to: item.to });
      }
    }
  }

  return {
    algorithm: 'prim',
    type: 'mst',
    applicable: visited.size > 1,
    originId: startNodeId,
    selectedEdges: mstEdges,
    totalCost: Number(totalCost.toFixed(4)),
    visitedCount: visited.size,
    executionMs: Number((performance.now() - startMs).toFixed(4)),
    steps
  };
}

module.exports = prim;