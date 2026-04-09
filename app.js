/**
 * Configuración de la aplicación Express
 */

const express = require('express');
const viewsRoutes = require('./src/routes/views.routes.js');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`📍 ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Rutas API
app.use('/api', viewsRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    name: 'Stream Views Monitor API',
    version: '1.0.0',
    endpoints: {
      'GET /api/views': 'Obtiene viewers de todos los canales en todas las plataformas',
      'GET /api/health': 'Health check del servidor'
    },
    documentation: 'https://github.com/tu-repo/stream-views-monitor'
  });
});

// Middleware de error 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Middleware de error general
app.use((err, req, res, next) => {
  console.error('❌ Error en Express:', err.message);
  
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    status: err.status || 500,
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
