const { performance } = require('node:perf_hooks');
const { buildAdjacency, getNodeMap } = require('../utils/graphUtils');
const MinHeap = require('./MinHeap');

function dijkstra(graph, originId, destinationId, weightKey = 'distance') {
  const startMs = performance.now();
  const nodes = graph.nodes;
  const edges = graph.edges;
  const nodeMap = getNodeMap(nodes);
  
  // EL LIBRETO DE ANIMACIÓN
  const steps = []; 

  if (!nodeMap.has(originId) || !nodeMap.has(destinationId)) {
    return { applicable: false, message: 'Origen o destino inexistente.', steps: [] };
  }

  const adjacency = buildAdjacency(nodes, edges, weightKey);
  const distances = new Map(nodes.map(node => [node.id, Infinity]));
  const previousNode = new Map();
  const previousEdge = new Map();
  const visited = new Set();
  
  // Usamos nuestra nueva Cola de Prioridad O(E log V)
  const pq = new MinHeap(); 

  distances.set(originId, 0);
  pq.insert(originId, 0);

  steps.push({ stepCode: 'INIT', activeNode: originId, description: 'Inicializando distancias y agregando nodo origen al Heap.' });

  while (!pq.isEmpty()) {
    const { nodeId: current, weight: currentDistance } = pq.extractMin();
    steps.push({ stepCode: 'EXTRACT_MIN', activeNode: current, description: `Extrayendo nodo con menor distancia: ${current}` });

    if (currentDistance > distances.get(current)) continue;
    
    visited.add(current);
    steps.push({ stepCode: 'MARK_VISITED', activeNode: current, description: `Marcando nodo ${current} como visitado.` });

    if (current === destinationId) {
      steps.push({ stepCode: 'DESTINATION_REACHED', activeNode: current, description: '¡Destino alcanzado!' });
      break;
    }

    const neighbors = adjacency.get(current) || [];
    for (const item of neighbors) {
      if (visited.has(item.to)) continue;

      steps.push({ stepCode: 'EVALUATE_NEIGHBOR', activeNode: current, targetNode: item.to, activeEdge: item.edgeId, description: `Evaluando vecino ${item.to}` });

      const alternative = currentDistance + item.weight;
      if (alternative < distances.get(item.to)) {
        distances.set(item.to, alternative);
        previousNode.set(item.to, current);
        previousEdge.set(item.to, item.edgeId);
        pq.insert(item.to, alternative);
        
        steps.push({ stepCode: 'RELAX_EDGE', activeNode: current, targetNode: item.to, distance: alternative, description: `Actualizando distancia más corta a ${item.to}` });
      }
    }
  }

  const pathNodes = [];
  const pathEdges = [];
  let cursor = destinationId;
  
  while (cursor) {
    pathNodes.unshift(cursor);
    if (previousEdge.has(cursor)) {
      pathEdges.unshift(previousEdge.get(cursor));
    }
    cursor = previousNode.get(cursor);
  }

  return {
    algorithm: 'dijkstra',
    type: 'shortest_path',
    applicable: distances.get(destinationId) !== Infinity,
    originId,
    destinationId,
    pathNodes,
    pathEdges,
    selectedEdges: pathEdges,
    totalCost: distances.get(destinationId) === Infinity ? null : Number(distances.get(destinationId).toFixed(4)),
    visitedCount: visited.size,
    executionMs: Number((performance.now() - startMs).toFixed(4)),
    steps // <--- Mandamos el historial al Frontend
  };
}

module.exports = dijkstra;