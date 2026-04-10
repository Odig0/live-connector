/**
 * Controlador para operaciones con live_count
 * 
 * Maneja las requests y responses para los endpoints de transmisiones en vivo
 */

const liveCountService = require('../services/live-count.service');

// ============================================================================
// TABLA PRINCIPAL: live_count (Totales)
// ============================================================================

/**
 * POST /api/live/create
 * Crear o actualizar un registro de transmisión
 * Solo guarda si view_count > 0
 */
async function create(req, res) {
  try {
    console.log('📝 POST /api/live/create');
    
    const { channel_name, platform, view_count } = req.body;
    
    if (!channel_name || !platform) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren channel_name y platform',
        timestamp: new Date().toISOString(),
      });
    }
    
    // Validar que view_count sea > 0
    if (view_count === undefined || view_count === null || view_count <= 0) {
      return res.status(400).json({
        success: false,
        error: 'view_count debe ser mayor a 0',
        received: view_count,
        timestamp: new Date().toISOString(),
      });
    }
    
    const result = await liveCountService.createLiveRecord({
      channel_name,
      platform,
      view_count,
    });
    
    res.status(201).json({
      success: true,
      message: 'Registro creado/actualizado correctamente',
      data: result,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * GET /api/live/all
 * Obtener todos los registros
 */
async function getAll(req, res) {
  try {
    console.log('📖 GET /api/live/all');
    
    const result = await liveCountService.getAllRecords();
    
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * GET /api/live/platform/:platform
 * Obtener registros por plataforma
 */
async function getByPlatform(req, res) {
  try {
    const platform = req.params.platform;
    console.log(`📖 GET /api/live/platform/${platform}`);
    
    const result = await liveCountService.getRecordsByPlatform(platform);
    
    res.status(200).json({
      success: true,
      platform,
      count: result.rows.length,
      data: result.rows,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * GET /api/live/channel/:channel
 * Obtener registros por canal
 */
async function getByChannel(req, res) {
  try {
    const channel = req.params.channel;
    console.log(`📖 GET /api/live/channel/${channel}`);
    
    const result = await liveCountService.getRecordsByChannel(channel);
    
    res.status(200).json({
      success: true,
      channel,
      count: result.rows.length,
      data: result.rows,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * POST /api/live/update/:id
 * Actualizar un registro
 */
async function update(req, res) {
  try {
    const id = req.params.id;
    console.log(`✏️  POST /api/live/update/${id}`);
    
    if (!req.body.view_count) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere view_count para actualizar',
        timestamp: new Date().toISOString(),
      });
    }
    
    const result = await liveCountService.updateRecord(id, {
      view_count: req.body.view_count,
    });
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Registro no encontrado',
        timestamp: new Date().toISOString(),
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Registro actualizado correctamente',
      data: result,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * DELETE /api/live/delete/:id
 * Eliminar un registro
 */
async function deleteRecord(req, res) {
  try {
    const id = req.params.id;
    console.log(`🗑️  DELETE /api/live/delete/${id}`);
    
    const result = await liveCountService.deleteRecord(id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Registro no encontrado',
        timestamp: new Date().toISOString(),
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Registro eliminado correctamente',
      data: result,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

// ============================================================================
// TABLA HISTÓRICO: live_count_history (Se guarda cada 30 segundos)
// ============================================================================

/**
 * POST /api/live/history/snapshot
 * Guardar snapshot en histórico (cada 30 segundos)
 */
async function saveSnapshot(req, res) {
  try {
    console.log('📸 POST /api/live/history/snapshot');
    
    const { channel_name, platform, view_count, live_count_id } = req.body;
    
    if (!channel_name || !platform) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren channel_name y platform',
        timestamp: new Date().toISOString(),
      });
    }
    
    const result = await liveCountService.saveHistorySnapshot({
      channel_name,
      platform,
      view_count,
      live_count_id,
    });
    
    res.status(201).json({
      success: true,
      message: 'Snapshot guardado en histórico',
      data: result,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * GET /api/live/history/channel/:channel/:platform
 * Obtener histórico por canal y plataforma
 */
async function getHistoryByChannel(req, res) {
  try {
    const { channel, platform } = req.params;
    const limit = req.query.limit || 100;
    console.log(`📊 GET /api/live/history/channel/${channel}/${platform}`);
    
    const result = await liveCountService.getHistoryByChannelPlatform(channel, platform, limit);
    
    res.status(200).json({
      success: true,
      channel,
      platform,
      count: result.rows.length,
      data: result.rows,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * GET /api/live/history/date/:date
 * Obtener histórico por fecha
 */
async function getHistoryByDate(req, res) {
  try {
    const { date } = req.params;
    console.log(`📊 GET /api/live/history/date/${date}`);
    
    const result = await liveCountService.getHistoryByDate(date);
    
    res.status(200).json({
      success: true,
      date,
      count: result.rows.length,
      data: result.rows,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * GET /api/live/history/platform/:platform
 * Obtener histórico por plataforma
 */
async function getHistoryByPlatform(req, res) {
  try {
    const { platform } = req.params;
    const limit = req.query.limit || 100;
    console.log(`📊 GET /api/live/history/platform/${platform}`);
    
    const result = await liveCountService.getHistoryByPlatform(platform, limit);
    
    res.status(200).json({
      success: true,
      platform,
      count: result.rows.length,
      data: result.rows,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * GET /api/live/history/summary/:platform/:date
 * Obtener resumen estadístico del histórico
 */
async function getHistorySummary(req, res) {
  try {
    const { platform, date } = req.params;
    console.log(`📊 GET /api/live/history/summary/${platform}/${date}`);
    
    const result = await liveCountService.getHistorySummary(platform, date);
    
    res.status(200).json({
      success: true,
      platform,
      date,
      count: result.rows.length,
      data: result.rows,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * GET /api/live/health
 * Verificar conexión a la base de datos
 */
async function health(req, res) {
  try {
    console.log('🏥 GET /api/live/health');
    
    const db = require('../../config/database');
    const isConnected = await db.checkConnection();
    
    if (isConnected) {
      res.status(200).json({
        success: true,
        status: 'connected',
        message: 'Conexión a PostgreSQL establecida',
        database: {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          database: process.env.DB_NAME,
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        success: false,
        status: 'disconnected',
        message: 'No se pudo conectar a PostgreSQL',
        timestamp: new Date().toISOString(),
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(503).json({
      success: false,
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = {
  // Tabla Principal
  create,
  getAll,
  getByPlatform,
  getByChannel,
  update,
  deleteRecord,
  
  // Tabla Histórico
  saveSnapshot,
  getHistoryByChannel,
  getHistoryByDate,
  getHistoryByPlatform,
  getHistorySummary,
  
  // Health
  health,
};
