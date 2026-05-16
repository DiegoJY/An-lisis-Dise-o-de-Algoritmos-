# GeoRutas GraphGPS

Web app responsive para visualizar un mapa interactivo centrado en Zacatecas, México, seleccionar nodos de origen/destino, ejecutar algoritmos de grafos y trazar los resultados directamente sobre el mapa.

## Stack

- Node.js
- Express.js
- SQLite con `better-sqlite3`
- HTML semántico
- CSS responsive
- JavaScript vanilla modular
- Leaflet + mapa base CartoDB/OpenStreetMap
- Google Fonts + Material Symbols Rounded

## Funcionalidades incluidas

- Mapa enfocado en Zacatecas, México, con límites geográficos para evitar carga innecesaria del mundo completo.
- Fondo local de respaldo para que el grafo siga visible aunque algunos tiles externos fallen.
- Nodos, aristas y pesos renderizados sobre el mapa.
- Selección de origen y destino desde el mapa o desde selectores.
- Dijkstra para ruta mínima origen-destino.
- Prim para árbol de expansión mínima desde un nodo inicial.
- Kruskal para árbol o bosque de expansión mínima.
- Trazado visual reforzado de rutas y árboles mínimos con capas Leaflet dedicadas.
- Panel de resultados con costo total, nodos visitados y tiempo de ejecución.
- Historial de ejecuciones en SQLite.
- Importación de grafos JSON.
- Exportación del resultado activo como JSON.
- UI true responsive inspirada visualmente en el PDF de Visily: tarjetas blancas, chips, bottom navigation móvil, paneles redondeados, badges de estado, alertas suaves y estilo app-like.

## Cambio aplicado en esta versión

Se retiró completamente la simulación GPS para concentrar el sistema en el trazado del grafo y en la generación/verificación de cálculos. El mapa ahora inicia y se mantiene dentro del área Zacatecas–Guadalupe para reducir solicitudes de tiles, acelerar la carga y mejorar la estabilidad visual.

## Instalación local

```bash
npm install
cp .env.example .env
npm run init-db
npm run dev
```

Abrir:

```text
http://localhost:3000
```

## Ejecución en modo producción local

```bash
npm start
```

## Pruebas de algoritmos

```bash
npm test
```

## Formato para importar grafo JSON

```json
{
  "nodes": [
    { "id": "A", "name": "Nodo A", "lat": 22.77, "lng": -102.58, "type": "waypoint", "description": "Punto A" },
    { "id": "B", "name": "Nodo B", "lat": 22.76, "lng": -102.56, "type": "waypoint", "description": "Punto B" }
  ],
  "edges": [
    { "id": "AB", "sourceId": "A", "targetId": "B", "distance": 1.4, "time": 4.2, "cost": 2.0, "bidirectional": 1, "label": "A-B" }
  ]
}
```

## Estructura

```text
georutas-graphgps/
├── app.js
├── package.json
├── config/
├── database/
├── routes/
├── controllers/
├── services/
├── models/
├── middleware/
├── algorithms/
├── utils/
├── public/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── img/
├── tests/
└── docs/
```

## Preparación para Linux

1. Instalar Node.js LTS.
2. Copiar el proyecto al servidor.
3. Ejecutar `npm install`.
4. Crear `.env` basado en `.env.example`.
5. Inicializar base de datos con `npm run init-db`.
6. Ejecutar con `npm start` o mediante PM2:

```bash
pm2 start app.js --name georutas-graphgps
pm2 save
```
