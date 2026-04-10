/**
 * Rutas para operaciones con live_count
 * 
 * Endpoints para crear, leer, actualizar y eliminar registros de transmisiones en vivo
 */

const express = require('express');
const liveCountController = require('../controllers/live-count.controller');

const router = express.Router();

// ============================================================================
// TABLA PRINCIPAL: live_count (Totales)
// ============================================================================

/**
 * POST /api/live/create
 * Crear/actualizar registro en tabla principal
 * 
 * Request body:
 * {
 *   "channel_name": "El Deber",
 *   "platform": "tiktok",
 *   "view_count": 2500
 * }
 */
router.post('/create', liveCountController.create);

/**
 * GET /api/live/all
 * Obtener todos los registros
 */
router.get('/all', liveCountController.getAll);

/**
 * GET /api/live/platform/:platform
 * Obtener registros por plataforma
 * 
 * Ejemplo: /api/live/platform/tiktok
 */
router.get('/platform/:platform', liveCountController.getByPlatform);

/**
 * GET /api/live/channel/:channel
 * Obtener registros por canal
 * 
 * Ejemplo: /api/live/channel/El%20Deber
 */
router.get('/channel/:channel', liveCountController.getByChannel);

/**
 * POST /api/live/update/:id
 * Actualizar un registro
 * 
 * Request body:
 * {
 *   "view_count": 5000
 * }
 */
router.post('/update/:id', liveCountController.update);

/**
 * DELETE /api/live/delete/:id
 * Eliminar un registro
 * 
 * Ejemplo: DELETE /api/live/delete/1
 */
router.delete('/delete/:id', liveCountController.deleteRecord);

// ============================================================================
// TABLA HISTÓRICO: live_count_history (Se guarda cada 30 segundos)
// ============================================================================

/**
 * POST /api/live/history/snapshot
 * Guardar snapshot en histórico (cada 30 segundos)
 * 
 * Request body:
 * {
 *   "channel_name": "El Deber",
 *   "platform": "tiktok",
 *   "view_count": 2500,
 *   "live_count_id": 1  (opcional)
 * }
 */
router.post('/history/snapshot', liveCountController.saveSnapshot);

/**
 * GET /api/live/history/channel/:channel/:platform
 * Obtener histórico por canal y plataforma
 * 
 * Query params (opcional):
 * - limit: número de registros (default: 100)
 * 
 * Ejemplo: /api/live/history/channel/El%20Deber/tiktok?limit=50
 */
router.get('/history/channel/:channel/:platform', liveCountController.getHistoryByChannel);

/**
 * GET /api/live/history/date/:date
 * Obtener histórico por fecha
 * 
 * Ejemplo: /api/live/history/date/2026-04-10
 */
router.get('/history/date/:date', liveCountController.getHistoryByDate);

/**
 * GET /api/live/history/platform/:platform
 * Obtener histórico por plataforma
 * 
 * Query params (opcional):
 * - limit: número de registros (default: 100)
 * 
 * Ejemplo: /api/live/history/platform/tiktok?limit=50
 */
router.get('/history/platform/:platform', liveCountController.getHistoryByPlatform);

/**
 * GET /api/live/history/summary/:platform/:date
 * Obtener resumen estadístico del histórico
 * 
 * Ejemplo: /api/live/history/summary/tiktok/2026-04-10
 */
router.get('/history/summary/:platform/:date', liveCountController.getHistorySummary);

// ============================================================================
// Health Check
// ============================================================================

/**
 * GET /api/live/health
 * Verificar conexión a la base de datos
 */
router.get('/health', liveCountController.health);

module.exports = router;
