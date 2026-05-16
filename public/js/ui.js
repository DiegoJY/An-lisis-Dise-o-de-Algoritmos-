import { state } from './state.js';

const lineMap = {
    dijkstra: { 'INIT': 4, 'EXTRACT_MIN': 6, 'MARK_VISITED': 7, 'EVALUATE_NEIGHBOR': 8, 'RELAX_EDGE': 11, 'DESTINATION_REACHED': 7 },
    prim: { 'INIT': 4, 'EXTRACT_MIN': 6, 'CYCLE_DETECTED': 7, 'UNION_EDGE': 9, 'EVALUATE_NEIGHBOR': 11 },
    kruskal: { 'INIT': 2, 'SORT_EDGES': 3, 'EVALUATE_EDGE': 5, 'UNION_EDGE': 7, 'CYCLE_DETECTED': 5 }
};

export function initUI() {
    const codeCard = document.querySelector('.code-card');
    if (codeCard) codeCard.style.minWidth = '420px';

    document.getElementById('languageSelect').addEventListener('change', (e) => {
        state.selectedLanguage = e.target.value;
        updateCodeViewer();
    });

    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            state.selectedAlgorithm = e.target.dataset.algorithm;
            document.getElementById('algorithmStatus').innerHTML = `<span class="material-symbols-rounded">bolt</span> ${e.target.innerText}`;
            updateCodeViewer();
        });
    });

    document.getElementById('btnClearSelection').addEventListener('click', () => {
        document.getElementById('originSelect').value = '';
        document.getElementById('destinationSelect').value = '';
        document.getElementById('currentInstruction').textContent = 'Selecciona origen y destino';
        document.getElementById('originSelect').dispatchEvent(new Event('change'));
    });
}

export function populateSelectors(nodes, edges) {
    const originSelect = document.getElementById('originSelect');
    const destSelect = document.getElementById('destinationSelect');
    
    originSelect.innerHTML = '<option value="">Selecciona origen...</option>';
    destSelect.innerHTML = '<option value="">Selecciona destino...</option>';

    nodes.forEach(node => {
        const name = node.name || `Nodo ${node.id}`;
        const option = `<option value="${node.id}">${name}</option>`;
        originSelect.insertAdjacentHTML('beforeend', option);
        destSelect.insertAdjacentHTML('beforeend', option);
    });

    document.getElementById('metricNodes').textContent = nodes.length;
    document.getElementById('metricEdges').textContent = edges.length;
}

export function updateCodeViewer(stepCode = null) {
    const viewer = document.getElementById('codeViewer');
    if (!state.currentScripts || !state.selectedLanguage || !state.selectedAlgorithm) return;

    const code = state.currentScripts[state.selectedLanguage];
    if (!code) return;
    const lines = code.split('\n');
    
    const algoMap = lineMap[state.selectedAlgorithm] || {};
    const targetLine = algoMap[stepCode] || -1;

    viewer.innerHTML = lines.map((line, idx) => {
        const isHighlight = (idx + 1) === targetLine;
        return `<div class="code-line ${isHighlight ? 'line-highlight' : ''}" style="${isHighlight ? 'background-color: #fef08a; font-weight: bold; color: #000; padding: 2px 4px; border-radius: 4px;' : 'padding: 2px 4px;'}">${line}</div>`;
    }).join('');

    const highlighted = viewer.querySelector('.line-highlight');
    if (highlighted) {
        const container = viewer.parentElement;
        container.scrollTop = highlighted.offsetTop - (container.clientHeight / 2) + (highlighted.clientHeight / 2);
    }
}

export function showResult(result) {
    document.getElementById('resultTitle').textContent = 'Resultado final';
    document.getElementById('statCost').textContent = result.totalCost || '—';
    document.getElementById('statVisited').textContent = result.visitedCount;
    document.getElementById('statTime').textContent = `${result.executionMs}ms`;
}

export function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}