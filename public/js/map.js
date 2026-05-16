import { state } from './state.js';

let map;
let nodesLayer = L.layerGroup();
let edgesLayer = L.layerGroup();
let pathLayer = L.layerGroup();
let animationLayer = L.layerGroup();
const markers = new Map();

export function initMap() {
    map = L.map('map', { zoomControl: false }).setView([22.775, -102.572], 15);
    
    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: '© Google',
        maxZoom: 20
    }).addTo(map);
    
    edgesLayer.addTo(map);
    pathLayer.addTo(map);
    animationLayer.addTo(map);
    nodesLayer.addTo(map);
}

export function renderGraph(graph, options = {}) {
    nodesLayer.clearLayers();
    edgesLayer.clearLayers();
    markers.clear();

    if (!graph || !graph.nodes) return;

    if (options.showEdges && graph.edges) {
        graph.edges.forEach(edge => {
            const fromId = edge.sourceId || edge.fromId || edge.source_id;
            const toId = edge.targetId || edge.toId || edge.target_id;
            const fromNode = graph.nodes.find(n => n.id === fromId);
            const toNode = graph.nodes.find(n => n.id === toId);
            
            if (fromNode && toNode) {
                L.polyline([[fromNode.lat, fromNode.lng], [toNode.lat, toNode.lng]], {
                    color: '#94a3b8', weight: 2, dashArray: '4, 6', opacity: 0.8
                }).addTo(edgesLayer);
            }
        });
    }

    graph.nodes.forEach(node => {
        const marker = L.circleMarker([node.lat, node.lng], {
            radius: 7, fillColor: '#ffffff', color: '#2563eb', weight: 2, fillOpacity: 1
        }).bindTooltip(node.name || `Nodo ${node.id}`).addTo(nodesLayer);
        
        marker.on('click', () => {
            const originSelect = document.getElementById('originSelect');
            const destSelect = document.getElementById('destinationSelect');
            if (!originSelect.value || (originSelect.value && destSelect.value)) {
                originSelect.value = node.id;
                destSelect.value = '';
            } else {
                if (originSelect.value !== String(node.id)) {
                    destSelect.value = node.id;
                }
            }
            document.getElementById('currentInstruction').textContent = 
                originSelect.value && destSelect.value ? 'Listo para calcular' : 'Selecciona destino';
        });
        markers.set(node.id, marker);
    });
}

export function fitBounds(graph) {
    if (!graph || !graph.nodes || graph.nodes.length === 0) return;
    const bounds = L.latLngBounds(graph.nodes.map(n => [n.lat, n.lng]));
    map.fitBounds(bounds.pad(0.1));
}

export function clearPath() {
    pathLayer.clearLayers();
    animationLayer.clearLayers();
    markers.forEach(m => m.setStyle({ fillColor: '#ffffff', color: '#2563eb' }));
}

export async function animateSteps(steps, graph, onStep) {
    clearPath();
    if (!steps) return;
    for (const step of steps) {
        const node = graph.nodes.find(n => n.id === step.activeNode);
        if (node && markers.has(node.id)) {
            markers.get(node.id).setStyle({ fillColor: '#facc15', color: '#eab308' });
        }

        if (step.activeEdge) {
            const edge = graph.edges.find(e => e.id === step.activeEdge);
            if (edge) {
                const fromId = edge.sourceId || edge.fromId || edge.source_id;
                const toId = edge.targetId || edge.toId || edge.target_id;
                const from = graph.nodes.find(n => n.id === fromId);
                const to = graph.nodes.find(n => n.id === toId);
                if (from && to) {
                    L.polyline([[from.lat, from.lng], [to.lat, to.lng]], {
                        color: '#f59e0b', weight: 5, opacity: 0.8
                    }).addTo(animationLayer);
                }
            }
        }

        onStep(step);
        await new Promise(resolve => setTimeout(resolve, 200));
    }
}

export function drawFinalPath(pathNodes, pathEdges, graph) {
    if (!pathEdges) return;
    pathEdges.forEach(edgeId => {
        const edge = graph.edges.find(e => e.id === edgeId);
        if (edge) {
            const fromId = edge.sourceId || edge.fromId || edge.source_id;
            const toId = edge.targetId || edge.toId || edge.target_id;
            const from = graph.nodes.find(n => n.id === fromId);
            const to = graph.nodes.find(n => n.id === toId);
            if (from && to) {
                L.polyline([[from.lat, from.lng], [to.lat, to.lng]], {
                    color: '#1d4ed8', weight: 6, opacity: 1
                }).addTo(pathLayer);
            }
        }
    });
}