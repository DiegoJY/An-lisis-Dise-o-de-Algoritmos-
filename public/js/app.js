import api from './api.js';
import { state } from './state.js';
import * as map from './map.js';
import * as ui from './ui.js';

async function initApp() {
    try {
        map.initMap();
        ui.initUI();
        state.selectedAlgorithm = 'dijkstra';

        const response = await api.getGraph();
        if (response && response.nodes && response.nodes.length > 0) {
            state.graph = response;
            ui.populateSelectors(state.graph.nodes, state.graph.edges);
            map.renderGraph(state.graph, { showEdges: document.getElementById('toggleGraph').checked });
            map.fitBounds(state.graph);
        }
    } catch (error) {
        console.error(error);
        ui.showToast('Error al cargar el grafo inicial');
    }
}

async function handleRunAlgorithm() {
    const params = {
        algorithm: state.selectedAlgorithm,
        originId: document.getElementById('originSelect').value,
        destinationId: document.getElementById('destinationSelect').value,
        weightKey: document.getElementById('weightSelect').value
    };

    if (params.algorithm === 'dijkstra' && (!params.originId || !params.destinationId)) {
        ui.showToast('Dijkstra requiere seleccionar origen y destino');
        return;
    } else if (params.algorithm === 'prim' && !params.originId) {
        ui.showToast('Prim requiere seleccionar al menos un origen');
        return;
    }

    try {
        map.clearPath();
        document.getElementById('btnRunAlgorithm').disabled = true;

        const response = await api.runAlgorithm(params);
        if (response.ok) {
            state.currentScripts = response.scripts;
            state.selectedLanguage = document.getElementById('languageSelect').value;
            ui.updateCodeViewer();
            
            if (response.data.result.steps) {
                await map.animateSteps(response.data.result.steps, response.data.graph, (step) => {
                    ui.updateCodeViewer(step.stepCode);
                    document.getElementById('currentInstruction').textContent = step.description;
                });
            }

            const finalEdges = response.data.result.pathEdges || response.data.result.selectedEdges;
            map.drawFinalPath(response.data.result.pathNodes || [], finalEdges, response.data.graph);
            ui.showResult(response.data.result);
        } else {
            ui.showToast('No se encontró ruta aplicable');
        }
    } catch (error) {
        console.error(error);
        ui.showToast('Error al ejecutar el algoritmo');
    } finally {
        document.getElementById('btnRunAlgorithm').disabled = false;
    }
}

document.getElementById('btnRunAlgorithm').addEventListener('click', handleRunAlgorithm);
document.getElementById('toggleGraph').addEventListener('change', (e) => {
    if (state.graph) map.renderGraph(state.graph, { showEdges: e.target.checked });
});
document.addEventListener('DOMContentLoaded', initApp);