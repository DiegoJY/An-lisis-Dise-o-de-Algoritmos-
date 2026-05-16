require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { initializeDatabase } = require('./config/db');
const graphModel = require('./models/graph.model');
const indexRoutes = require('./routes/index.routes');
const algorithmRoutes = require('./routes/algorithm.routes');
const historyRoutes = require('./routes/history.routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

initializeDatabase();

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/graph', (req, res) => {
  try {
    const graph = graphModel.getGraph();
    res.json(graph);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/api', indexRoutes);
app.use('/api/algorithms', algorithmRoutes);
app.use('/api/history', historyRoutes);
app.use('/api', notFound);

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`GeoRutas GraphGPS disponible en http://localhost:${port}`);
});