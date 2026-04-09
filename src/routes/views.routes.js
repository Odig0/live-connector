/**
 * Rutas para el API de viewers
 */

const express = require('express');
const { getViewsPost } = require('../controllers/views.controller.js');

const router = express.Router();

/**
 * POST /api/views
 * Obtiene viewers de UN ÚNICO CANAL en las 3 plataformas
 * 
 * Request body (elige qué plataformas incluir):
 * {
 *   "youtube": "https://www.youtube.com/watch?v=...",
 *   "tiktok": "nombre_usuario",
 *   "facebook": "https://www.facebook.com/..."
 * }
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "timestamp": "2024-01-15T10:30:00Z",
 *   "duration": "3500ms",
 *   "data": {
 *     "youtube": 8278,
 *     "tiktok": 1200,
 *     "facebook": 450
 *   }
 * }
 */
router.post('/views', getViewsPost);

/**
 * GET /api/health
 * Health check del servidor
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
