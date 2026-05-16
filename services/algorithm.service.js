const graphModel = require('../models/graph.model');
const dijkstra = require('../algorithms/dijkstra');
const prim = require('../algorithms/prim');
const kruskal = require('../algorithms/kruskal');
const historyModel = require('../models/history.model');
const { normalizeWeightKey } = require('../utils/graphUtils');
const AppError = require('../utils/AppError');

function runAlgorithm({ algorithm, originId, destinationId, weightKey }) {
  const graph = graphModel.getGraph();
  const selectedWeightKey = normalizeWeightKey(weightKey);
  const selectedAlgorithm = String(algorithm || '').toLowerCase();
  let result;

  if (selectedAlgorithm === 'dijkstra') {
    if (!originId || !destinationId) {
      throw new AppError('Dijkstra requiere origen y destino.', 422);
    }
    result = dijkstra(graph, originId, destinationId, selectedWeightKey);
  } else if (selectedAlgorithm === 'prim') {
    result = prim(graph, originId, selectedWeightKey);
  } else if (selectedAlgorithm === 'kruskal') {
    result = kruskal(graph, selectedWeightKey);
  } else {
    throw new AppError('Algoritmo no soportado. Usa dijkstra, prim o kruskal.', 422);
  }

  // Separamos los "steps" (el libreto de animación) para no saturar la BD
  const { steps, ...resultDataForDB } = result;

  // Guardamos solo la metadata en el historial
  historyModel.createRun({
    algorithm: resultDataForDB.algorithm,
    originId: resultDataForDB.originId || originId || null,
    destinationId: resultDataForDB.destinationId || destinationId || null,
    weightKey: selectedWeightKey,
    totalCost: resultDataForDB.totalCost,
    visitedCount: resultDataForDB.visitedCount,
    executionMs: resultDataForDB.executionMs,
    result: resultDataForDB
  });

  // Devolvemos al controlador el resultado completo, INCLUYENDO los pasos de animación
  return { result, graph };
}

module.exports = { runAlgorithm };