/**
 * Configuración de la aplicación Express
 */

const express = require('express');
const viewsRoutes = require('./src/routes/views.routes.js');
const liveCountRoutes = require('./src/routes/live-count.routes.js');

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
app.use('/api/live', liveCountRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    name: 'Stream Views Monitor API',
    version: '1.0.0',
    endpoints: {
      'POST /api/live/create': 'Crear un registro de transmisión',
      'POST /api/live/create-multiple': 'Crear múltiples registros',
      'GET /api/live/all': 'Obtener todos los registros',
      'GET /api/live/platform/:platform': 'Obtener por plataforma (tiktok|facebook|youtube)',
      'GET /api/live/channel/:channel': 'Obtener por canal',
      'GET /api/live/date/:date': 'Obtener por fecha (YYYY-MM-DD)',
      'GET /api/live/summary/:platform/:date': 'Resumen por plataforma y fecha',
      'POST /api/live/update/:id': 'Actualizar un registro',
      'DELETE /api/live/delete/:id': 'Eliminar un registro',
      'GET /api/live/health': 'Verificar conexión a base de datos',
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
